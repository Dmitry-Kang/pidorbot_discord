const Command = require('./command')

// Проверка на админа

class Nya extends Command {
    constructor() {
        super("nya", 0)
    }

    async func(src) {
        let msg = src['msg']
        msg.channel.send("nya")
    }
}
module.exports = new Nya()