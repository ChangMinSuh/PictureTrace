const Sequelize = require('sequelize');

module.exports = class BeforeTraceImage extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            fileName:{
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            filePath:{
                type: Sequelize.STRING(200),
                allowNull:false
            },
            fileSize:{
                type: Sequelize.INTEGER,
                allowNull:true,
            }

        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'BeforeTraceImage',
            tableName: 'beforeTraceImages',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'   
        })
    }
    
    static associate(db){
        db.BeforeTraceImage.belongsTo(db.User);
    }
}