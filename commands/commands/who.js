const Command = require('./command')

// Ищет пидора в гильдии

class Who extends Command {
    constructor() {
        super("who", "any")
    }

    async func(src) {
        let msg = src['msg']
        const guild = msg.guild
        const users = await this.funcs.findUsers(guild)
        let arr = []
        users.forEach(usr => {
            arr.push({user_id: usr.id, server_id: guild.id})
        })
        this.epicdb.temp_user.addUsersIfNotExist(arr)
    
        const role = msg.guild.roles.cache.find(role => role.name === "Пидор")
    
        const cur_users = await this.epicdb.user.getAllUsersFromGuild(guild.id)
        let index = Math.round(Math.random()*100) % cur_users.length
        const user = guild.members.cache.get(cur_users[index].user_id)
        msg.channel.send(this.funcs.toQuoteString(this.funcs.toBoldString(this.funcs.getRandomWhoPidorLeft() + " " + this.funcs.markUser(user.id) + " " + this.funcs.getRandomWhoPidorRight())))
    
        // ищем всех пидоров в гильдии и снимаем им роль
        await this.funcs.uptatePidorTime(guild)
        await this.funcs.deleteAllPidors(guild)
        await this.epicdb.pidor.deleteAllPidorsFromGuild(guild.id)
    
        // добавляем пидора и даём ему роль
        const res = await this.epicdb.pidor.addPidorIfNotExist({server_id: guild.id, user_id: user.id})
        guild.members.cache.get(user.id).roles.add(role)
    }
}
module.exports = new Who()