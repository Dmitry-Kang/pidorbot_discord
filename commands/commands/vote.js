const Command = require('./command')

// Проверка на админа

class Vote extends Command {
    constructor() {
        super("vote", "any")
    }

    async func(src) {
        let msg = src['msg']
        let args = src['args'] // <@![0-9]+>
        if (args.length != 1) {
            msg.channel.send(this.funcs.toBoldString(this.funcs.getRandomWrongCommand()))
            return
        }
        if (args[0].match("<@![0-9]+>")) {
            let from_id = msg.author.id
            let to_id = args[0].substr(3)
            to_id = to_id.substr(0, to_id.length-1)

            
        }
        //console.log("args ", args)

        //msg.channel.send("!s")
    }
}
module.exports = new Vote()