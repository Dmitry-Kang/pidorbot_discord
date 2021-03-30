const { getRandomLoterySuccess } = require('../../funcs')
const Command = require('./command')

// Проверка на админа

class Vote extends Command {
    constructor() {
        super("vote", "any")
    }

    async func(src) {
        let msg = src['msg']
        let args = src['args']
        let from_id = 0
        let to_id = 0
        if (args.length != 1 || !args[0].match("<@![0-9]+>")) {
            msg.channel.send(this.funcs.toBoldString(this.funcs.getRandomWrongCommand()))
            return
        }
        from_id = msg.author.id
        to_id = args[0].substr(3)
        to_id = to_id.substr(0, to_id.length-1)
        if (from_id == to_id) {
            msg.channel.send(this.funcs.toBoldString(this.funcs.getRandomLotterySelfVoting()))
            return
        }
        let from_user = await this.epicdb.user.getUser(msg.guild.id, from_id)
        if (from_user.lottery_can_vote === undefined || from_user.lottery_can_vote === false) {
            msg.channel.send(this.funcs.toBoldString(this.funcs.getRandomLotteryCantVote()))
            return
        }
        await this.epicdb.user.setLotteryTicket(msg.guild.id, from_id, to_id)
        msg.channel.send(this.funcs.toBoldString(getRandomLoterySuccess()))
    }
}
module.exports = new Vote()