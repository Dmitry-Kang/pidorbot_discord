const Command = require('./command')

// Проверка на админа

class Except extends Command {
    constructor() {
        super("except", "admin")
    }

    async func(src) {
        let msg = src['msg']
        let args = src['args']
        if (args.length != 1 || !args[0].match("<@![0-9]+>")) {
            msg.channel.send(this.funcs.toBoldString(this.funcs.getRandomWrongCommand()))
            return
        }
        let user_id = 0
        user_id = args[0].substr(3)
        user_id = user_id.substr(0, user_id.length-1)

        await this.epicdb.user.setExcept(msg.guild.id, user_id)

        msg.channel.send(this.funcs.toBoldString(this.funcs.getRandomSuccess()))
    }
}
module.exports = new Except()