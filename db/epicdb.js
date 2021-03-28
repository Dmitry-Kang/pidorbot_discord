const {Sequelize, DataTypes, Model, QueryTypes} = require("sequelize")
const user_create = require('./models/User')
const temp_user_create = require('./models/Temp_user')
const pidor_create = require('./models/Pidor')
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

let User = user_create(sequelize)
let Pidor = pidor_create(sequelize)
let Temp_user = temp_user_create(sequelize)

async function addUsersIfNotExist(users) {
    try {
        await Temp_user.bulkCreate( users ).then(async ()=>  {
            const res = await sequelize.query("SELECT (user_id, server_id) FROM temp_users EXCEPT SELECT (user_id, server_id) FROM users")
            await Temp_user.destroy({
                where: {},
                truncate: true
              })
            console.log("res", JSON.stringify(res[0]))
            let arr = []
            await res[0].forEach(item => {
                arr.push(item.row)
            })
            console.log("arr ", arr.join(","))
            await sequelize.query("INSERT INTO users (user_id, server_id) VALUES " + arr.join(","))
            
        })
    } catch(e) {
        console.log("err1", e)
    }
    return true
}

async function getAllUsersFromGuild(id) {
    try {
        const a = await User.findAll({where: {
            server_id: id
          }})
        //console.log(a)
        return a
    } catch(e) {
        console.log("err2")
    }
}

async function updateUserTime(server_id, user_id , hours) {
    try {
        const a = await User.update(
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

async function getTopUsersFromGuild(id) {
    try {
        const a = await User.findAll(
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

async function getAllPidorsFromGuild(id) {
    try {
        const a = await Pidor.findAll({where: {
            server_id: id
          }})
        return a
    } catch(e) {
        console.log("err3")
    }
}

async function deleteAllPidorsFromGuild(id) {
    try {
        const a = await Pidor.destroy({where: {
            server_id: id
          }})
        return a
    } catch(e) {
        console.log("err4")
    }
}

async function addPidorIfNotExist(pidor) {
    try {
        const a = await Pidor.create( pidor )
        //console.log(a)
    } catch(e) {
        console.log("err5")
    }
    return true
}

module.exports = {sequelize, addUsersIfNotExist, getAllUsersFromGuild, updateUserTime, getTopUsersFromGuild, 
                  getAllPidorsFromGuild, addPidorIfNotExist, deleteAllPidorsFromGuild}
