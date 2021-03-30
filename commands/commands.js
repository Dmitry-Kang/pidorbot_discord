const CommandHandler = require("./CommandHandler")
const Who = require('./commands/who')
const Top = require('./commands/top')
const Nya = require('./commands/nya')
const Help = require('./commands/help')
const Vote = require('./commands/vote')
const Set = require('./commands/set')
const Except = require('./commands/except')

// Добавление комманд

CommandHandler.add(Who)
CommandHandler.add(Top)
CommandHandler.add(Nya)
CommandHandler.add(Help)
CommandHandler.add(Vote)
CommandHandler.add(Set)
CommandHandler.add(Except)