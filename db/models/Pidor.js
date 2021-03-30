const {DataTypes, Model} = require("sequelize")

class Pidor {
    constructor(sequelize) {
        this.sequelize = sequelize

        class Temp extends Model {}
        Temp.init({
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
        Temp.sync({ alter: true })
        
        this.temp = Temp
    }

    // Ищет пидора по id(string) гильдии
    // Возвращает id юзера - пидора
    async getAllPidorsFromGuild(id) {
        try {
            const a = await this.temp.findAll({where: {
                server_id: id
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

    // Удаляет всех пидоров из id(string) гильдии
    async deleteAllPidorsFromGuild(id) {
        try {
            const a = await this.temp.destroy({where: {
                server_id: id
              }})
            if (a.length > 0) {
                return true
            }
            return false
        } catch(e) {
            console.error(e)
            return false
        }
    }

    // Добавляет пидора
    // Входные данные {server_id, user_id}
    // Выходные данные true, false
    async addPidorIfNotExist(pidor) {
        try {
            const a = await this.temp.create( pidor )
            return true
        } catch(e) {
            console.error(e)
            return false
        }
    }
}

module.exports = Pidor
