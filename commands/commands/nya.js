const Command = require('./command')

// Проверка на админа

class Who extends Command {
    constructor() {
        super("nya", "admin")
    }

    async func(src) {
        let msg = src['msg']
        let res = await this.epicdb.pidor.getAllPidorsFromGuild("asd")
        console.log("res = ", res)
        msg.channel.send(this.funcs.toBoldString("Nya"))
    }
}
module.exports = new Who()