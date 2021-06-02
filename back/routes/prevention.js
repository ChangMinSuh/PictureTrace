const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto')
const Sequelize = require('sequelize');

const sanitizeHtml = require('sanitize-html') //xss공격 방어

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {User, PreventionPost, PreventionImage} = require('../models');
const router = express.Router();

const upload = multer({ 
    storage: multer.diskStorage({
        destination(req, file, cb){
            const hash = crypto.randomBytes(8).toString('hex');
            try{
                fs.readdirSync(`uploads/preventionImages/${hash}`);
            } catch(err){
                console.error('uploads파일이 없어 생성합니다.');
                fs.mkdirSync(`uploads/preventionImages/${hash}`);
            }
            cb(null,`uploads/preventionImages/${hash}`);
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, file.originalname);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024},
})

const uploadNone = multer();

// 게시판 목록 load
router.get('/',async (req, res,next) =>{
    try{
        console.log('prevention load');
        const loadPreventionPosts = await PreventionPost.findAll({
            include:[
                {
                    model: PreventionImage,
                },
                {
                    model: User,
                    attributes: [    'nickname'],
                  }
            ],
            order: [['id','DESC']],
        });
        res.json(loadPreventionPosts);
    } catch(err){
        console.error(err);
        next(err);
    }
})

// 게시글 업로드시 이미지 미리 저장
router.post('/image', isLoggedIn, upload.array('image'), async(req, res, next)=>{
    try{
        console.log('success upload image');
        res.json(req.files);
    } catch (err) {
        console.error(err);
    }
})  

// 게시글 업로드
router.post('/upload', isLoggedIn, uploadNone.none(), async (req, res,next) =>{
    console.log(req.files);
    try{
        const preventionPost = await PreventionPost.create({
            title: req.body.title,
            content: req.body.content,
            UserId: req.user.id,
        })
        if(req.body.image){
            if(Array.isArray(req.body.image)){
                await Promise.all(req.body.image.map( image =>
                    PreventionImage.create({ filePath: path.join(image.destination,image.filename), PreventionPostId: preventionPost.id})
                ))
            } else{
                await PreventionImage.create({filePath:req.body.image, PreventionPostId: preventionPost.id})
            }
        }
        const fullPost = await PreventionPost.findOne({
            where: { id: preventionPost.id },
            include: [
              {
                model: User,
                attributes: ['nickname'],
              },
              {
                model: PreventionImage
              }
            ],
          });
        res.json(fullPost);
    } catch(err){
        console.error(err);
        next(err);
    }
})

// 게시판 글 수정 
router.patch('/update/:id', isLoggedIn, async (req, res, next) =>{
    console.log('req.body',req.body);
    try{
        const id = req.params.id;
        await PreventionPost.update({
            title: req.body.title,
            content: req.body.content,
            updatedAt: Sequelize.NOW,
        },{
            where: {id}
        })
        const updatePost = await PreventionPost.findOne({
            where:{id},
            include: [
                {
                  model: User,
                  attributes: ['nickname'],
                },
                {
                  model: PreventionImage
                }
              ],
        })
        res.json(updatePost);
    } catch(err){
        console.error(err);
        next(err);
    }
})

//게시판 글 삭제
router.delete('/delete/:id', isLoggedIn, async (req, res, next) =>{
    try{
        const id = req.params.id;
        console.log('start delete',id);
        const preventionPost = await PreventionPost.findOne({
            where: {id},
        })
        console.log(preventionPost);
        if(req.user.id === preventionPost.UserId){
            const preventionImage = await PreventionImage.destroy({
                where: {PreventionPostId: id},  
            })
            const preventionPost = await PreventionPost.destroy({
                where: {id},
            })
            res.send('success!');
        }else {
            const message = encodeURIComponent('회원이 일치하지 않습니다.');
            res.send(message);
        }
    } catch(err){
        console.error(err);
        next(err);
    }
})

// 조회수up
router.patch('/upViews/:id',async(req, res) =>{
    const id = req.params.id;
    await PreventionPost.update({views : Sequelize.literal('views + 1')},{
        where:{
            id,
        },
    })
    const postViews = await PreventionPost.findOne({
        where:{id},
        attributes:['views'],
    })
    res.json(postViews.views);
})

module.exports = router;    