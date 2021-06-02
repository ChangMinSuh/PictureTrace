const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

dotenv.config();
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
})
const indexRouter = require('./routes');
const authRouter = require('./routes/auth');
const traceRouter = require('./routes/trace');
const preventionRouter = require('./routes/prevention');
const {sequelize} = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 3085);
sequelize.sync({force: false})
    .then(()=>{
        console.log('db 연결 완료');
    })
    .catch((err) =>{
        console.error(err);
    })

app.use(cors({
    origin:'http://localhost:3000',
    credentials: true,
}))
if(process.env.NODE_ENV === 'production'){
    app.enable('trust proxy');
    app.use(morgan('combined'));
    app.use(helmet({ contentSecurityPolicy: false}));
    app.use(hpp()); 
} else{
    app.use(morgan('dev'))
}
app.use(express.static(path.join(__dirname,'../front/public')));
app.use('/img/uploads',express.static(path.join(__dirname,'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    store: new RedisStore({ client: redisClient}),
};
if(process.env.NODE_ENV === 'production'){
    sessionOption.proxy = true;
}

app.use(session(sessionOption))

app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/',indexRouter);
app.use('/prevention',preventionRouter);
app.use('/auth',authRouter);
app.use('/trace',traceRouter);

app.use((req, res, next) =>{
    const error = new Error(`${req.method} ${req.url}라우터가 없습니다.`);
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) =>{
    res.status(err.status || 500);
    res.render({
        message:err.message,
        err: process.env.NODE_ENV !== 'production' ? err : {},
    });
})

app.listen(app.get('port'), () =>{
    console.log(app.get('port'), '포트에서 실행중');
})