const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email:{
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate:{
                    isEmail: true,
                }
            },
            nickname:{
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password:{
                type: Sequelize.STRING(100),
                allowNull: false,
            },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'   
        })
    }
    static associate(db){
        db.User.hasMany(db.PreventionPost);
        db.User.hasMany(db.BeforeTraceImage);
        db.User.hasMany(db.AfterTraceImage);
        
    }
}