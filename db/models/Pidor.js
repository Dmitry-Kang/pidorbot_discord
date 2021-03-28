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

    async getAllPidorsFromGuild(id) {
        try {
            const a = await this.temp.findAll({where: {
                server_id: id
              }})
            return a
        } catch(e) {
            console.log("err3")
        }
    }

    async deleteAllPidorsFromGuild(id) {
        try {
            const a = await this.temp.destroy({where: {
                server_id: id
              }})
            return a
        } catch(e) {
            console.log("err4")
        }
    }

    async addPidorIfNotExist(pidor) {
        try {
            const a = await this.temp.create( pidor )
            //console.log(a)
        } catch(e) {
            console.log("err5")
        }
        return true
    }
}

module.exports = Pidor
