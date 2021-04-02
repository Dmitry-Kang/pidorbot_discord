const funcs = require ('../funcs.js')

// Сообщению подаются сюда и для них ищется команда которую нужно выполнить

class CommandHandler {
    constructor() {
        this.commands = []
        this.command = ""
        this.msg = ""
        this.args = ""
    }

    add(command) {
        this.commands.push(command)
    }

    handle(msg) {
        this.msg = msg
        this.args = msg.content.split(' ')
        console.log("NEW COMMAND\nargs = ", this.args,"\n")
        this.command = this.args[0].substring(1)
        this.args.shift()
        let found = false
        this.commands.forEach(handler => {
            if (this.command.match(handler.expression)) {
                found = true
                let user_role = funcs.checkRole(this.msg)
                console.log("role = " + user_role)
                if (handler.role != 0 || (user_role < 2)) {
                    if (handler.role > 2 && user_role < 3) {
                        msg.channel.send(funcs.toBoldString(funcs.getRandomNotAdmin()))
                        return
                    }
                    if (handler['role'] === 2 && user_role === 2) {
                        msg.channel.send(funcs.toBoldString(funcs.getRandomNotPidor()))
                        return
                    }
                }
                let res = handler.func({msg: this.msg, args: this.args})
                return
            }
        })
        if (!found) {
            msg.channel.send(funcs.toBoldString(funcs.getRandomWrongCommand()))
        }
    }
}

let handler = new CommandHandler()

module.exports = handler