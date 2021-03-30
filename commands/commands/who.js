const Command = require('./command')

// Ищет пидора в гильдии

class Who extends Command {
    constructor() {
        super("who", "any")
    }

    async func(src) {
        let msg = src['msg']
        const guild = msg.guild

        let db_guild = await this.epicdb.guild.getGuild(guild.id)
        let date = Date.now()
        let db_date = new Date(db_guild.last_voting)
        let delta_date = date - db_date
        console.log("math = ", Math.round((delta_date)/(1000*60*60)))
        delta_date = db_guild.voting_timer - Math.round((delta_date)/(1000*60*60))
        if (delta_date > 0) {
            msg.channel.send(this.funcs.toBoldString("Эту команду можно прописать через " + delta_date + " часов" ))
            return
        }

        const users = await this.funcs.findUsers(guild)
        let arr = []
        users.forEach(usr => {
            arr.push({user_id: usr.id, server_id: guild.id})
        })
        await this.epicdb.temp_user.addUsersIfNotExist(arr)
        await this.epicdb.guild.addGuild(guild.id)
    
        const role = msg.guild.roles.cache.find(role => role.name === "Пидор")
    
        const cur_users = await this.epicdb.user.getAllUsersFromGuild(guild.id)
        let index = await this.funcs.getLotteryVote(cur_users)
        const user = guild.members.cache.get(index)
        msg.channel.send(this.funcs.toQuoteString(this.funcs.toBoldString(this.funcs.getRandomWhoPidorLeft() + " " + this.funcs.markUser(user.id) + " " + this.funcs.getRandomWhoPidorRight())))

        // Ставит победителю 1 билет и добавляет всем возможность голосовать
        await this.epicdb.user.updateVotings(guild.id, index)
    
        // ищем всех пидоров в гильдии и снимаем им роль
        await this.funcs.uptatePidorTime(guild)
        await this.funcs.deleteAllPidors(guild)
    
        // добавляем пидора и даём ему роль
        const res = await this.epicdb.pidor.addPidorIfNotExist({server_id: guild.id, user_id: user.id})
        await this.epicdb.user.incrPidorsCntToUser(guild.id, user.id)
        guild.members.cache.get(user.id).roles.add(role)
    }
}
module.exports = new Who()