const Command = require('./command')

// Проверка на админа

class Who extends Command {
    constructor() {
        super("nya", "admin")
    }

    async func(src) {
        let msg = src['msg']
        msg.channel.send(this.funcs.toBoldString("Nya"))
    }
}
module.exports = new Who()