const {DataTypes, Model} = require("sequelize")

    class User {
        constructor(sequelize) {
            this.sequelize = sequelize

            class Temp extends Model{}
            Temp.init({
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
            })
            Temp.sync({ alter: true })

            this.temp = Temp
        }


        async getAllUsersFromGuild(id) {
            try {
                const a = await this.temp.findAll({where: {
                    server_id: id
                  }})
                //console.log(a)
                return a
            } catch(e) {
                console.log("err2")
            }
        }

        async updateUserTime(server_id, user_id , hours) {
            try {
                const a = await this.temp.update(
                    {hours: hours},
                    {where: {
                    server_id: server_id,
                    user_id: user_id
                  }})
                console.log(a)
                return a
            } catch(e) {
                console.log("err6")
            }
        }

        async getTopUsersFromGuild(id) {
            try {
                const a = await this.temp.findAll(
                    {where: {server_id: id},
                    limit: 10,
                    order: [['hours', 'DESC']]}
                )
                //console.log(a)
                return a
            } catch(e) {
                console.log("err7",e)
            }
        }
    }

module.exports = User
