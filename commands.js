const CommandHandler = require("./classes/CommandHandler")
const {addUsersIfNotExist, getAllUsersFromGuild, getAllPidorsFromGuild, deleteAllPidorsFromGuild, addPidorIfNotExist, getTopUsersFromGuild} = require('./db/epicdb.js');
const funcs = require ('./funcs.js');

// Добавление комманд
// expression - регурярка или название комманды
// function - код который выполняется
// role - кто может использовать команду ['any','admin','user','pidor']
CommandHandler.add({expression:"who", function:(src) => who(src), role:"any"})
CommandHandler.add({expression:"top", function:(src) => top(src), role:"any"})
CommandHandler.add({expression:"nya", function:(src) => nya(src), role:"admin"})


// Функции для комманд
async function who(src) {
    msg = src['msg']
    const guild = msg.guild
    const users = await funcs.findUsers(guild)
    addUsersIfNotExist(users)

    const role = msg.guild.roles.cache.find(role => role.name === "Пидор")

    const cur_users = await getAllUsersFromGuild(guild.id)
    let index = Math.round(Math.random()*100) % cur_users.length
    const user = guild.members.cache.get(cur_users[index].dataValues.user_id)
    msg.channel.send(funcs.toQuoteString(funcs.toBoldString(funcs.getRandomWhoPidorLeft() + " " + funcs.markUser(user.id) + " " + funcs.getRandomWhoPidorRight())))

    // ищем всех пидоров в гильдии и снимаем им роль
    await funcs.uptatePidorTime(guild)
    await funcs.deleteAllPidors(guild)
    await deleteAllPidorsFromGuild(guild.id)

    // добавляем пидора и даём ему роль
    const res = await addPidorIfNotExist({server_id: guild.id, user_id: user.id})
    guild.members.cache.get(user.id).roles.add(role)
}

async function top(src) {
    msg = src['msg']
    const guild = msg.guild
    const now = Date.now();
    let arr = [];
    let res = '';
    let t = 1;
    const top_users = await getTopUsersFromGuild(guild.id);
    
    const pidors = await getAllPidorsFromGuild(guild.id);

    top_users.forEach(user => {
        pidors.forEach(pidor => {
        if (pidor.user_id === user.user_id) {
            const pidorUpdatedDate = new Date(pidor.createdAt);
            const timeToPut = now - pidorUpdatedDate;
            arr.push({name: funcs.markUser(user.user_id), time: Math.round((user.hours + timeToPut)/(1000*60))});
           
        } else {
            arr.push({name: funcs.markUser(user.user_id), time: Math.round(user.hours/(1000*60))});
        }
        })
    })
    arr.sort((a,b) => b.time - a.time);
    
    arr.forEach( elem => {
        res += t + ": " + elem.name  + " " + elem.time + " минут";
        if (t === 1) {
            res += " " + funcs.toSpoilerString(funcs.getRandomTopPidorLeader());
        }
        res += "\n";
        t++;
    })
    msg.channel.send( funcs.toQuoteString( funcs.toBoldString(funcs.getRandomTopPidorTop() + "\n" + res)));
}

async function nya(src) {
    msg = src['msg']
    msg.channel.send(funcs.toBoldString("Nya"));
}