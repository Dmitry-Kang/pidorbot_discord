const {DataTypes, Model} = require("sequelize");

module.exports = function (sequelize) {
    class User extends Model {}

    User.init({
        server_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        hours: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('NOW()')
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('NOW()')
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'server_id']
            }
        ],
        sequelize, 
        modelName: 'user'
    }); 
    User.sync({ alter: true })

    return User;
}
