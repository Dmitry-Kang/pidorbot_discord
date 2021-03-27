const Discord = require('discord.js'); 
const bot = new Discord.Client();
const {addUsersIfNotExist, getAllUsersFromGuild, getAllPidorsFromGuild, deleteAllPidorsFromGuild, addPidorIfNotExist, getTopUsersFromGuild} = require('./db/epicdb.js');
const funcs = require ('./funcs.js');
require('dotenv').config()

let config = require('./botconfig.json'); 

let token = process.env.DISCORD_TOKEN; 
let prefix = config.prefix;


bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => { 
        console.log(link);
    });
});

bot.on('message',async msg => {
    if (msg.author.username !== config.name) {
        //const guild = await bot.guilds.fetch(msg.guild.id);
        const guild = msg.guild;
        //const channel = bot.channels.cache.get(msg.channel.id);

        if (msg.content === prefix + 'who') {
            const users = await funcs.findUsers(guild);
            addUsersIfNotExist(users);

            const role = msg.guild.roles.cache.find(role => role.name === "Пидор");

            const cur_users = await getAllUsersFromGuild(guild.id);
            let index = Math.round(Math.random()*100) % cur_users.length;
            const user = bot.users.cache.get(cur_users[index].dataValues.user_id);
            //console.log("user", user.username);
            msg.channel.send(funcs.toQuoteString(funcs.toBoldString(funcs.getRandomWhoPidorLeft() + " " + funcs.markUser(user.id) + " " + funcs.getRandomWhoPidorRight())));

            // ищем всех пидоров в гильдии и снимаем им роль
            await funcs.uptatePidorTime(guild);
            await funcs.deleteAllPidors(guild);
            await deleteAllPidorsFromGuild(guild.id);

            // добавляем пидора и даём ему роль
            const res = await addPidorIfNotExist({server_id: guild.id, user_id: user.id});
            guild.members.cache.get(user.id).roles.add(role);
        }

        if (msg.content === prefix + 'top') {
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

        if (msg.member.permissions.has(["ADMINISTRATOR"])) {
            //                                              fc force clear - удаляет всех пидоров
                if (msg.content === prefix + 'fc') {
                    const role = msg.guild.roles.cache.find(role => role.name === "Пидор");
                    console.log("role", role);
                    const cur_users = await getAllUsersFromGuild(guild.id);
                    
                    for (key of cur_users) {
                        const usr = guild.members.cache.get(key.dataValues.user_id);
                        usr.roles.remove(role);
                    }
                }

                //                                      nya - nya 
                if (msg.content === prefix + 'nya') {
                    msg.channel.send("nya");
                }
            }
    }
});

bot.login(token);

