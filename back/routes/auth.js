const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const User = require('../models/user');    

const router = express.Router();

//세션 client로 보냄
router.get('/',async(req, res, next) =>{
    const user = req.user;
    res.json(user);
})

// 로그인
router.post('/login', isNotLoggedIn,(req, res, next) =>{
    passport.authenticate('local',(authError, user, info) =>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.status(401).json(info);
        }
        return req.login(user, (loginError) =>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.json(user);
        })
    })(req,res,next);
})

//로그아웃
router.post('/logout', isLoggedIn, (req, res, next) =>{
    req.logout();
    req.session.destroy(); // 선택사항
    console.log('logout');
    return res.status(200).send('로그아웃 되었습니다.');
})

// 회원가입
router.post('/signUp', isNotLoggedIn, async (req, res, next) => {
    const {email, nickname, password} = req.body;
    try{
        const chkUser = await User.findOne({where: {email}});
        if(chkUser){ //회원가입되었다면
            return res.status(403).json({
                errorCode: 1,
                message: '이미 회원가입 되어있습니다.',
              });
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nickname,
            password: hash,
        })
        return res.status(201).json({
            message: '성공적으로 회원가입 되었습니다.'
        });
    } catch(err){
        console.error(err);
        return next(err);
    }
})

module.exports = router;