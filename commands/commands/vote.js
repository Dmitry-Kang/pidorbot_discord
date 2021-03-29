const Command = require('./command')

// Проверка на админа

class Vote extends Command {
    constructor() {
        super("vote", "any")
    }

    async func(src) {
        let msg = src['msg']
        let args = src['args']
        console.log("args ", args)

        msg.channel.send("!s")
    }
}
module.exports = new Vote()