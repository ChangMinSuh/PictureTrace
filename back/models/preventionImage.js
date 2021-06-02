const Sequelize = require('sequelize');

module.exports = class PreventionImage extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            filePath:{
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'PreventionImage',
            tableName: 'preventionImages',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'   
        })
    }
    
    static associate(db){
        db.PreventionImage.belongsTo(db.PreventionPost);
    }
}