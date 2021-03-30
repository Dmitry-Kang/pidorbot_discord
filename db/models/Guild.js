const {DataTypes, Model} = require("sequelize")

class Guild {
    constructor(sequelize) {
        this.sequelize = sequelize

        class Temp extends Model {}
        Temp.init({
        server_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        voting_timer: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 12
        },
        last_voting: {
            type: DataTypes.DATE,
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
        }, {
            indexes: [
                {
                    unique: true,
                    fields: ['server_id']
                }
            ],
            sequelize, 
            modelName: 'guild'
        })
        Temp.sync({ alter: true })

        this.temp = Temp
    }

    // Создаёт гильдию
    // Входные данные guild_id
    // Выходные данные - {id, server_id, voting_timer, last_voting, createdAt, updatedAt}
    async addGuild(guild_id) {
        try {
            let res = await this.temp.create( {server_id: guild_id} )
            return res.dataValues
        } catch(e) {
            console.error(e)
            return undefined
        }
    }

    // Возвращает гильдию по id гильдии
    async getGuild(guild_id) {
        try {
            let res = await this.temp.findOne({where: {server_id: guild_id}})
            return res.dataValues
        } catch(e) {
            console.error(e)
            return undefined
        }
    }

    // Обновляет таймер становления пидором
    // Входные данные - guild id(string), hours(string)
    // Выходные данные true, false
    async updateVotingTimer(guild_id, hours) {
        try {
            await this.temp.update(
                {voting_timer: hours},
                {where: {server_id: guild_id}
            })
            return true
        } catch(e) {
            console.error(e)
            return false
        }
    }

    // Обновляет таймер последних выборов пидора
    // Входные данные - guild id(string)
    // Выходные данные true, false
    async updateLastVote(guild_id) {
        try {
            await this.temp.update(
                {last_voting: this.sequelize.literal('NOW()')},
                {where: {server_id: guild_id}
            })
            return true
        } catch(e) {
            console.error(e)
            return false
        }
    }
}

module.exports = Guild