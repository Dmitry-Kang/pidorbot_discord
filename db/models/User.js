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
                is_excepted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
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
                    server_id: id,
                    is_excepted: false
                  }})
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
                    {where: {server_id: id, is_excepted: false},
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

        // Выводит топ 10 юзеров по количеству билетов
        // Входные данные id(string) гильдии
        // Выходные данные [{id,server_id,user_id,hours,createdAt,updatedAt,lottery_tickets_cnt,lottery_can_vote,pidor_voted_cnt}]
        async getTopNextUsersFromGuild(id) {
            try {
                const a = await this.temp.findAll(
                    {where: {server_id: id, is_excepted: false},
                    limit: 10,
                    order: [['lottery_tickets_cnt', 'DESC']]}
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

        // Выводит юзера по гильдии и айди юзера
        async getUser(guild_id, user_id) {
            try {
                const a = await this.temp.findOne({
                    where: {
                        server_id: guild_id,
                        user_id: user_id
                    }
                })
                return a.dataValues
            } catch(e) {
                console.error(e)
                return null
            }
        }

        // Прибавляет количество выборки в пидоры юзера по гильдии и айди юзера
        async incrPidorsCntToUser(guild_id, user_id) {
            try {
                const a = await this.temp.increment('pidor_voted_cnt', { by: 1, where: {server_id: guild_id, user_id: user_id} })
                if (a[0][1] === 1) {
                    return true
                }
                return false
            } catch(e) {
                console.error(e)
                return false
            }
        }

        // Даёт лотерейный билетик юзеру
        async setLotteryTicket(guild_id, from_user_id, to_user_id) {
            try {
                await this.temp.increment('lottery_tickets_cnt', { by: 1, where: {server_id: guild_id, user_id: to_user_id} })
                await this.sequelize.query("UPDATE users SET lottery_can_vote = false WHERE user_id = " + "'" + from_user_id + "'" + " and server_id = " + "'" +guild_id+ "'")
                return true
            } catch(e) {
                console.error(e)
                return false
            }
        }

        // Ставит 1 билет у победителя голосования, всем добавляет возможность голосовать
        // Входные данные server_id(string), user_winner_id(string)
        // Выходные данные true, false
        async updateVotings(server_id, user_winner_id) {
            try {
                await this.temp.update(
                    {lottery_tickets_cnt: 1},
                    {where: {
                    server_id: server_id,
                    user_id: user_winner_id
                  }})
                  await this.temp.update(
                    {lottery_can_vote: true},
                    {where: {
                    server_id: server_id
                  }})
                return true
            } catch(e) {
                console.error(e)
                return false
            }
        }

        // Убирает или добавляет возможность играть в пидора
        // т.е. может стать пидором, отображается в списках и т.д
        async setExcept(guild_id, user_id) {
            try {
                const a = await this.temp.findOne({
                    where: {
                        server_id: guild_id,
                        user_id: user_id
                    }
                })
                await this.temp.update(
                    {is_excepted: !a.dataValues.is_excepted},
                    {where: {
                    server_id: guild_id,
                    user_id: user_id
                  }})
                return true
            } catch(e) {
                console.error(e)
                return false
            }
        }
    }

module.exports = User
