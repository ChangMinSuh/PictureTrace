const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () =>{
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async(email, password, done) =>{
        try{
            const chkUser = await User.findOne({ where: {email}});
            console.log(chkUser);
            if(chkUser){ // 이메일 일치
                const result = await bcrypt.compare(password, chkUser.password);
                console.log(result);
                if(result){ // 비번일치
                    done(null, chkUser);
                    } else { // 비번틀림
                    done(null, false,{message:'비밀번호가 일치하지 않습니다.'});
                }
            } else { //이메일 틀림
                done(null, false, {message: '가입되지 않은 회원입니다.'});
            }
        } catch (err) {
            console.error(err);
            done(err);  //서버 에러
        }
    }))
}