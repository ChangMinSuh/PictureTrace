const Sequelize = require('sequelize');

module.exports = class AfterInfoFull extends Sequelize.Model{
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
            modelName: 'AfterInfoFull',
            tableName: 'afterInfoFulls',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'   
        })
    }
    
    static associate(db){
        db.AfterInfoFull.belongsTo(db.AfterTraceImage);
    }
}