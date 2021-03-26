const {Sequelize, DataTypes, Model, QueryTypes} = require("sequelize");
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
    });
} else if(process.env.POSTGRES_DB && process.env.POSTGRES_PASSWORD) {
    sequelize = new Sequelize(process.env.POSTGRES_DB, "postgres", process.env.POSTGRES_PASSWORD, {
        dialect: "postgres"
    })
} else {
    console.log("В .env файле нехватает параметров для работы с базой данных, прочитайте readme или пните разраба(лучше ненадо)")
}


try_connection = async () =>  {
    try {
        await sequelize.authenticate();
        console.log('Запустилось БэДэшка, ебать');
        return true;
    } catch (error) {
        console.error('ОПА! БД наебнулось, ебать: ', error);
        return false;
    }
}
try_connection();

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
  User.sync({ alter: true });

console.log(User === sequelize.models.User);

class Pidor extends Model {}

    Pidor.init({
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
    }); 
    Pidor.sync({ alter: true });

console.log(Pidor === sequelize.models.Pidor);

class Temp_user extends Model {}

    Temp_user.init({
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
    }); 
    Temp_user.sync({ alter: true });

console.log(Temp_user === sequelize.models.Temp_user);

async function addUsersIfNotExist(users) {
    try {
        await Temp_user.bulkCreate( users ).then(async ()=>  {
            const res = await sequelize.query("SELECT (user_id, server_id) FROM temp_users EXCEPT SELECT (user_id, server_id) FROM users");
            await Temp_user.destroy({
                where: {},
                truncate: true
              });
            console.log("res", JSON.stringify(res[0]));
            let arr = [];
            await res[0].forEach(item => {
                arr.push(item.row);
            });
            console.log("arr ", arr.join(","));
            await sequelize.query("INSERT INTO users (user_id, server_id) VALUES " + arr.join(","));
            
        });
    } catch(e) {
        console.log("err1", e);
    }
    return true;
}

async function getAllUsersFromGuild(id) {
    try {
        const a = await User.findAll({where: {
            server_id: id
          }});
        //console.log(a);
        return a;
    } catch(e) {
        console.log("err2");
    }
}

async function updateUserTime(server_id, user_id , hours) {
    try {
        const a = await User.update(
            {hours: hours},
            {where: {
            server_id: server_id,
            user_id: user_id
          }});
        console.log(a);
        return a;
    } catch(e) {
        console.log("err6");
    }
}

async function getTopUsersFromGuild(id) {
    try {
        const a = await User.findAll(
            {where: {server_id: id},
            limit: 10,
            order: [['hours', 'DESC']]}
        );
        //console.log(a);
        return a;
    } catch(e) {
        console.log("err7",e);
    }
}

async function getAllPidorsFromGuild(id) {
    try {
        const a = await Pidor.findAll({where: {
            server_id: id
          }});
        return a;
    } catch(e) {
        console.log("err3");
    }
}

async function deleteAllPidorsFromGuild(id) {
    try {
        const a = await Pidor.destroy({where: {
            server_id: id
          }});
        return a;
    } catch(e) {
        console.log("err4");
    }
}

async function addPidorIfNotExist(pidor) {
    try {
        const a = await Pidor.create( pidor );
        //console.log(a);
    } catch(e) {
        console.log("err5");
    }
    return true;
}

module.exports = {addUsersIfNotExist, getAllUsersFromGuild, updateUserTime, getTopUsersFromGuild, 
                  getAllPidorsFromGuild, addPidorIfNotExist, deleteAllPidorsFromGuild}
