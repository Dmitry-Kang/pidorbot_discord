const epicdb = require('../../db/epicdb.js')
const funcs = require ('../../funcs.js')

// Шаблон для всех комманд
// Содержит важные поля, нужные для обработки команд
// expression - регурярка или название комманды
// role - кто может использовать команду ['any','admin','user','pidor']

module.exports = class Command {
    constructor(expression, role) {
        this.funcs = funcs
        this.epicdb = epicdb
        this.expression = expression
        this.role = role
    }
}