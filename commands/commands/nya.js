const Command = require('./command')

// Проверка на админа

class Who extends Command {
    constructor() {
        super("nya", "any")
    }

    async func(src) {
        let msg = src['msg']
        msg.channel.send("!s")
    }
}
module.exports = new Who()