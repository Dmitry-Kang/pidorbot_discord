const CommandHandler = require("./CommandHandler")
const Who = require('./commands/who')
const Top = require('./commands/top')
const Nya = require('./commands/nya')

// Добавление комманд

CommandHandler.add(Who)
CommandHandler.add(Top)
CommandHandler.add(Nya)