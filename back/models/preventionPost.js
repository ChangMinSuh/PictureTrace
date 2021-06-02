const Sequelize = require('sequelize');

module.exports = class PreventionPost extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            title:{
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            content:{
                type: Sequelize.TEXT,
                allowNull: false,
            },
            views:{
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'PreventionPost',
            tableName: 'preventionPosts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'   
        })
    }
    
    static associate(db){
        db.PreventionPost.belongsTo(db.User);
        db.PreventionPost.hasMany(db.PreventionImage);
    }
}