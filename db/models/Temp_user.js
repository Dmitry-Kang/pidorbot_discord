const {DataTypes, Model} = require("sequelize")

class Temp_user {
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
        }, {
            indexes: [
                {
                    unique: true,
                    fields: ['user_id', 'server_id']
                }
            ],
            sequelize, 
            modelName: 'temp_user'
        })
        Temp.sync({ alter: true })

        this.temp = Temp
    }

    // Добавляет новых пользователей, которых ещё нету в бд но есть в гильдии
    // Входные данные [{server_id,user_id}]
    // Выходные данные true,false
    async addUsersIfNotExist(users) {
        try {
            await this.temp.bulkCreate( users )
            const res = await this.sequelize.query("SELECT (user_id, server_id) FROM temp_users EXCEPT SELECT (user_id, server_id) FROM users")
            await this.temp.destroy({
                where: {},
                truncate: true
            })
            let arr = []
            await res[0].forEach(item => {
                arr.push(item.row)
            })
            if (arr.length > 0) {
                await this.sequelize.query("INSERT INTO users (user_id, server_id) VALUES " + arr.join(","))
                this.sequelize
            }
            return true
        } catch(e) {
            console.error(e)
            return false
        }
    }
}

module.exports = Temp_user