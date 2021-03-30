const {Sequelize, DataTypes, Model, QueryTypes} = require("sequelize")
const User = require('./models/User')
const Temp_user = require('./models/Temp_user')
const Pidor = require('./models/Pidor')
const Guild = require('./models/Guild')
require('dotenv').config()
let sequelize

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
              }
        }
    })
} else if(process.env.POSTGRES_DB && process.env.POSTGRES_PASSWORD) {
    sequelize = new Sequelize(process.env.POSTGRES_DB, "postgres", process.env.POSTGRES_PASSWORD, {
        dialect: "postgres"
    })
} else {
    console.log("В .env файле нехватает параметров для работы с базой данных, прочитайте readme или пните разраба(лучше ненадо)")
}


try_connection =() => {
    try {
        sequelize.authenticate()
        console.log('Соединение с БД установлено')
        return true
    } catch (error) {
        console.error('Проблема с соединением с БД: ', error)
        return false
    }
}
try_connection()

let user = new User(sequelize)
let pidor = new Pidor(sequelize)
let temp_user = new Temp_user(sequelize)
let guild = new Guild(sequelize)

module.exports = {sequelize, user, pidor, temp_user, guild}
