const Command = require('./command')

// Проверка на админа

class Help extends Command {
    constructor() {
        super("help", 0)
    }

    async func(src) {
        let msg = src['msg']
        msg.channel.send(this.funcs.toBoldString("Список всех комманд можно посмотреть в гугл доке https://docs.google.com/document/d/1iZ34vipPjDJWfuItSTDa2OY-Vwl2Agw4X6Qaid4YOYY/edit?usp=sharing"))
    }
}
module.exports = new Help()