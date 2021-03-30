const Command = require('./command')

// Проверка на админа

class Set extends Command {
    constructor() {
        super("set", "admin")
    }

    async func(src) {
        let msg = src['msg']
        let guild = msg.guild
        let args = src['args']

        if (args.length < 2) {
            msg.channel.send(this.funcs.toBoldString(this.funcs.getRandomWrongCommand()))
            return
        }
        switch(args[0]) {
            case 'timer':
                let res = parseInt(args[1])
                if (!isNaN(res)) {
                    this.epicdb.guild.updateVotingTimer(guild.id, res)
                    msg.channel.send(this.funcs.toBoldString(this.funcs.getRandomSuccess()))
                } else {
                    msg.channel.send(this.funcs.toBoldString(this.funcs.getRandomWrongCommand()))
                }
                return  
            default:
                msg.channel.send(this.funcs.toBoldString(this.funcs.getRandomWrongCommand()))
                return
          }
    }
}
module.exports = new Set()