const Sequelize = require('sequelize');

module.exports = class AfterInfoCore extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            fileInfo:{
                type: Sequelize.TEXT,
                allowNull: false,
            },
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'AfterInfoCore',
            tableName: 'afterInfoCores',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'   
        })
    }
    
    static associate(db){
        db.AfterInfoCore.belongsTo(db.AfterTraceImage);
    }
}