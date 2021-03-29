const Command = require('./command')

// Выдаёт топ пидоров в гильдии

class Who extends Command {
    constructor() {
        super("top", "any")
    }

    async func(src) {
        let msg = src['msg']
        const guild = msg.guild
        const now = Date.now()
        let arr = []
        let res = ''
        const top_users = await this.epicdb.user.getTopUsersFromGuild(guild.id)
        
        const pidors = await this.epicdb.pidor.getAllPidorsFromGuild(guild.id)

        top_users.forEach(user => {
            pidors.forEach(pidor => {
            if (pidor.user_id === user.user_id) {
                const pidorUpdatedDate = new Date(pidor.createdAt)
                const timeToPut = now - pidorUpdatedDate
                arr.push({id: user.user_id ,name: this.funcs.markUser(user.user_id), time: Math.round((user.hours + timeToPut)/(1000*60))})
            
            } else {
                arr.push({id: user.user_id ,name: this.funcs.markUser(user.user_id), time: Math.round(user.hours/(1000*60))})
            }
            })
        })
        //arr.sort((a,b) => b.time - a.time)
        let t = 1
        for (const elem of arr) {
            let ress = await this.epicdb.user.getUser(guild.id, elem.id)
            let cnt = ress.pidor_voted_cnt
            res += t + ": " + elem.name  + " " + cnt + " раз (" + Math.round(elem.time/60) + ") часов"
            if (t === 1) {
                res += " " + this.funcs.toSpoilerString(this.funcs.getRandomTopPidorLeader())
            }
            res += "\n"
            t++
        }

        msg.channel.send( this.funcs.toQuoteString( this.funcs.toBoldString(this.funcs.getRandomTopPidorTop() + "\n" + res)))
    }
}
module.exports = new Who()