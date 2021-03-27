const {DataTypes, Model} = require("sequelize");

module.exports = function(sequelize) {
    class Pidor extends Model {}

    Pidor.init({
        server_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        sequelize, 
        modelName: 'pidor'
    })
    Pidor.sync({ alter: true })

    return Pidor
}