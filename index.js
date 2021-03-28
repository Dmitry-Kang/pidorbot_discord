const Discord = require('discord.js')
const bot = new Discord.Client()
require('dotenv').config()
require("./commands/commands")
let config = require('./botconfig.json')
const handler = require('./commands/CommandHandler.js')

// Тут бот ловит сообщения и отправляет их обработчику

let token = process.env.DISCORD_TOKEN
let prefix = config.prefix


bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`)
    bot.generateInvite(["ADMINISTRATOR"]).then(link => { 
        console.log(link)
    })
})

bot.on('message',async msg => {
    if (msg.author.username !== config.name) {
        if (msg.content.startsWith(prefix)) {
            await handler.handle(msg)
        }
    }
})

bot.login(token)

