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
                lottery_tickets_cnt: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 1
                },
                lottery_can_vote: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                },
                pidor_voted_cnt: {
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


        // Возвращает всех пользователей из гильдии
        // Входные данные id(string) гильдии
        // Выход [{}]
        async getAllUsersFromGuild(id) {
            try {
                const a = await this.temp.findAll({where: {
                    server_id: id
                  }})
                //console.log(a)
                let res = []
                a.forEach(element => {
                    res.push(element.dataValues)
                })
                return res
            } catch(e) {
                console.error(e)
                return []
            }
        }

        // Обновляет время пидора
        // Входные данные id_guild(string), user_id(string), time(Date)
        // Выходные данные true, false
        async updateUserTime(server_id, user_id , hours) {
            try {
                const a = await this.temp.update(
                    {hours: hours},
                    {where: {
                    server_id: server_id,
                    user_id: user_id
                  }})
                if (a[0] === 1) {
                    return true
                }
                return false
            } catch(e) {
                console.error(e)
                return false
            }
        }

        // Выводит топ 10 юзеров по времени пидораства
        // Входные данные id(string) гильдии
        // Выходные данные [{guild_id,user_id,hours,createdAt,updatedAt}]
        async getTopUsersFromGuild(id) {
            try {
                const a = await this.temp.findAll(
                    {where: {server_id: id},
                    limit: 10,
                    order: [['hours', 'DESC']]}
                )
                let res = []
                a.forEach(element => {
                    res.push(element.dataValues)
                })
                return res
            } catch(e) {
                console.error(e)
                return []
            }
        }
    }

module.exports = User
