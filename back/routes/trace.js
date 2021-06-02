const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto')
const { spawn } = require('child_process');

const { BeforeTraceImage,AfterTraceImage, AfterInfoFull ,AfterInfoCore} = require('../models');
const router = express.Router();

const uploadBefore = multer({ 
    storage: multer.diskStorage({
        destination(req, file, cb){
            const hash = crypto.randomBytes(8).toString('hex');
            try{
                fs.readdirSync(`uploads/beforeTraceImages/${hash}`);
            } catch(err){
                console.error('uploads파일이 없어 생성합니다.');
                fs.mkdirSync(`uploads/beforeTraceImages/${hash}`);
            }
            cb(null,`uploads/beforeTraceImages/${hash}`);
        },
        filename(req, file, cb) {
            cb(null, file.originalname);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024},
})

const uploadAfter = multer({ 
    storage: multer.diskStorage({
        destination(req, file, cb){
            const hash = crypto.randomBytes(10).toString('hex');
            try{
                fs.readdirSync(`uploads/AfterTraceImages/${hash}`);
            } catch(err){
                console.error('uploads파일이 없어 생성합니다.');
                fs.mkdirSync(`uploads/AfterTraceImages/${hash}`);
            }
            cb(null,`uploads/AfterTraceImages/${hash}`);
        },
        filename(req, file, cb) {
            cb(null, file.originalname);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024},
})

// BeforeTraceImages
router.get('/loadBeforeTraceImages',async(req, res, next) =>{
    try{
        const beforeTraceImages = await BeforeTraceImage.findAll({
            where:{UserId : req.user.id},
            attributes:['id','fileName','filePath','fileSize']
        })
        console.log('req.user.id ',req.user.id);
        console.log(beforeTraceImages);
        res.json(beforeTraceImages);
    } catch(err){
        console.error(err);
        next(err);
    }
})

router.post('/uploadBeforeTraceImages',uploadBefore.array('image'),async (req, res,next) =>{
    try{
        let returnArray=[];
        console.log(req.files);
        console.log('req.isAuthenticated()',req.isAuthenticated());
        console.log('req.user.id',req.user.id)
        for(let file of req.files){
            const beforeTraceImage = await BeforeTraceImage.create({
                fileName: file.filename,
                filePath: file.path,
                fileSize: file.size,
                UserId: req.user.id,
            })
            returnArray = returnArray.concat(beforeTraceImage)
        }
        res.json(returnArray);
    } catch(err){
        console.error(err);
        next(err);
    }
})

router.delete('/removeBeforeTraceImages/:id', async (req, res,next) =>{
    try{
        if(req.params.id){
            const removeBeforeTraceImage = await BeforeTraceImage.destroy({
                where:{
                    id: req.params.id
                }
            })
        }
        res.send('remove success');
    } catch(err){
        console.error(err);
        next(err);
    }
})

//processing
router.get('/processingTrace', async (req, res, next) =>{
    try{
        const imgId = req.query.imgId;
        const selectImg = await BeforeTraceImage.findOne({
            where:{
                id : imgId,
            }
        })
        console.log('selectImg',selectImg);
       
        const removeBeforeTraceImage = await BeforeTraceImage.destroy({
            where:{
                id: imgId
            }
        })
        
        console.log('removeBeforeTraceImage',removeBeforeTraceImage);

        const hash = selectImg.filePath.split('\\')[2];
        try{ // dir 생성
            fs.readdirSync(`uploads\\afterTraceImages\\${hash}`);
        } catch(err){
            console.error('uploads파일이 없어 생성합니다.');
            fs.mkdirSync(`uploads\\afterTraceImages\\${hash}`);
        }
        
        console.log('processingJava');
        const process_master = spawn('java', ['-jar', `..\\process\\PictureTrace-master.jar` ,   selectImg.filePath , selectImg.UserId , selectImg.id])

        process_master.stdout.on('data' ,async (data) => {
            console.log("process_db data:",data.toString());
        });
        
        process_master.stderr.on("data", function (data) {
            console.error("process_db error:",data.toString());
        });
        process_master.on('close', async (code) => {
            console.log(`child process exited with code ${code}`);
            
            const afterImg = await AfterTraceImage.create({
                fileName: selectImg.fileName,
                filePath: `uploads\\afterTraceImages\\${hash}\\${selectImg.fileName}`,
                fileSize: selectImg.fileSize,
                beforeTraceImageId: selectImg.id,
                UserId: selectImg.UserId,
            })
            console.log('afterImg!!',afterImg);

            const process_db = spawn('java', ['-jar', `..\\process\\PictureTrace-db.jar` ,   selectImg.filePath , selectImg.UserId , selectImg.id, afterImg.id])
            process_db.stdout.on('data' ,async (data) => {
                console.log("process_db data:",data.toString());
            });
            
            process_db.stderr.on("data", function (data) {
                console.error("process_db error:",data.toString());
            });
            process_db.on('close', async (code) => {
                console.log(`process_db exited with code ${code}`);
                const afterImgWithInfo = await AfterTraceImage.findOne({
                    where:{id : afterImg.id},
                    include:[
                        {
                            model: AfterInfoCore
                        },
                        {
                            model: AfterInfoFull
                        }                
                    ],
                    attributes:['id','fileName','filePath','fileSize'],
                })
                res.json(afterImgWithInfo);      
            });
            
        })
    } catch(err){
        console.error(err);
        next(err);
    }
})

// AfterTraceImages
router.get('/loadAfterTraceImages',async(req, res, next) =>{
    try{
        const afterTraceImages = await AfterTraceImage.findAll({
            where:{UserId : req.user.id},
            include:[
                {
                    model: AfterInfoCore
                },
                {
                    model: AfterInfoFull
                }                
            ],
            attributes:['id','fileName','filePath','fileSize'],
        })
        console.log('req.user.id ',req.user.id);
        console.log(afterTraceImages);
        res.json(afterTraceImages );
    } catch(err){
        console.error(err);
        next(err);
    }
})

router.post('/uploadAfterTraceImages',uploadAfter.array('image'),async (req, res,next) =>{
    try{
        let returnArray=[];
        console.log(req.files);
        console.log('req.isAuthenticated()',req.isAuthenticated());
        console.log('req.user.id',req.user.id)
        for(let file of req.files){
            const afterTraceImage = await AfterTraceImage.create({
                fileName: file.filename,
                filePath: file.path,
                fileSize: file.size,
                UserId: req.user.id,
            })
            returnArray = returnArray.concat(afterTraceImage)
        }
        res.json(returnArray);
    } catch(err){
        console.error(err);
        next(err);
    }
})

router.delete('/removeAfterTraceImages/:id', async (req, res,next) =>{
    try{
        if(req.params.id){
            const removeAfterTraceImage = await AfterTraceImage.destroy({
                where:{
                    id: req.params.id
                }
            })
        }
        res.send('remove success');
    } catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/downloadAfterTraceImages', async(req, res, next) =>{
    try{
        console.log('imgId:', req.query.imgId);
        if(req.query.imgId){
            const downloadAfterTraceImage = await AfterTraceImage.findOne({
                where:{
                    id: req.query.imgId
                }
            })
            res.download(downloadAfterTraceImage.filePath);
        }
    } catch(err){
        console.error(err);
        next(err);
    }
})

module.exports = router;