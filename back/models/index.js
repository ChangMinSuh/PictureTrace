const Sequelize = require('sequelize');
const User = require('./user');
const PreventionPost = require('./preventionPost');
const PreventionImage = require('./preventionImage');
const BeforeTraceImage = require('./beforeTraceImage');
const AfterTraceImage = require('./afterTraceImage');
const AfterInfoCore = require('./afterInfoCore');
const AfterInfoFull = require('./afterInfoFull');


const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db ={};

const sequelize = new Sequelize(config.database, config.username, config.password, config);


db.sequelize = sequelize;   
db.User = User;
db.PreventionPost = PreventionPost;
db.PreventionImage = PreventionImage;
db.BeforeTraceImage = BeforeTraceImage;
db.AfterTraceImage = AfterTraceImage;
db.AfterInfoCore = AfterInfoCore;
db.AfterInfoFull = AfterInfoFull;

User.init(sequelize);
PreventionPost.init(sequelize);
PreventionImage.init(sequelize);
BeforeTraceImage.init(sequelize);
AfterTraceImage.init(sequelize);
AfterInfoCore.init(sequelize);
AfterInfoFull.init(sequelize);

User.associate(db);
PreventionPost.associate(db);
PreventionImage.associate(db);
BeforeTraceImage.associate(db);
AfterTraceImage.associate(db);
AfterInfoCore.associate(db);
AfterInfoFull.associate(db);


module.exports = db;


