const epicdb = require('./db/epicdb.js')
const constants = require('./constants.json')

// Вспомогательные функции для команд

// Выводит всех пользователей гильдии
// Входные данные guild(Guild)
// Выходные данные [GuildMember]
async function findUsers(guild) {
    let res = []
    const members = await guild.members.fetch()
    const arr = members.array().filter((member) => !member.user.bot)
    for (key in arr) {
        res.push(arr[key])
    }
    return res
}

// Удаляет всех пидоров в данной гильдии
async function deleteAllPidors(guild) {
  const role = await guild.roles.cache.find(r => r.name == 'Пидор');

  all_users = await guild.members.fetch()
  all_users = all_users.filter(r => !r.user.bot)
  all_users.forEach((member, i) => { // Looping through the members of Role.
      member.roles.remove(role); // Removing the Role.
  });
  await epicdb.pidor.deleteAllPidorsFromGuild(guild.id)
}

// обновляет время пидорам гильдии
async function uptatePidorTime(guild) {
  const now = Date.now()
  await epicdb.guild.updateLastVote(guild.id)
  const pidors = await epicdb.pidor.getAllPidorsFromGuild(guild.id)
  const cur_users = await epicdb.user.getAllUsersFromGuild(guild.id)

  pidors.forEach(pidor => {
    cur_users.forEach(user => {
      if (pidor.user_id === user.user_id) {
        const pidorUpdatedDate = new Date(pidor.createdAt)
        const timeToPut = now - pidorUpdatedDate
        epicdb.user.updateUserTime(guild.id, user.user_id, user.hours + timeToPut)
      }
    })
  })
}

// Проводит лотерею и назначает победителя
// Выводит id юзера - победителя
async function getLotteryVote(users) {
  let max_tickets = 0
  users.forEach(user => {
    max_tickets += user.lottery_tickets_cnt
  })
  let index = Math.round(Math.random()*max_tickets)
  let res_id = 0
  for (let user in users) {
    
  }
  let found = false
  users.forEach(user => {
    if (!found) {
      index -= user.lottery_tickets_cnt
      if (index <= 0) {
        res_id = user.user_id
        found = true
      }
    }
  })
  return res_id
}

// async function setPidor(serverId, userId, role) {
//   // ищем всех пидоров в гильдии и снимаем им роль
//   const pidors = await epicdb.pidor.getAllPidorsFromGuild(server_id)
//   for (key of pidors) {
//     pidors[key].roles.remove(role)
//   }
//   await epicdb.pidor.deleteAllPidorsFromGuild(server_id)

//   // добавляем пидора и даём ему роль
//   const res = await epicdb.pidor.addPidorIfNotExist({server_id: serverId, user_id: userId})
// }

function checkRole(msg) {
  if (msg.member.id === '248006690979577858') {
    return 4 // razrab
  }
  if (msg.member.permissions.has(["ADMINISTRATOR"])) {
    return 3 // admin
  }
  if (msg.member.roles.cache.find(role => role.name === "Пидор")) {
    return 2 // pidor
  }
  return 1 // user
}

 function toQuoteString(str) {
  return ">>> " + str
}
 function toSpoilerString(str) {
  return "||" + str + "||"
}
 function toCodeString(str) {
  return "`" + str + "`"
}
 function toBoldString(str) {
  return "**" + str + "**"
}
function markUser(id) {
  return "<@" + id + ">"
}

function getRandomWhoPidorLeft() {
  return constants.whoPidorLeft[Math.round(Math.random()*(constants.whoPidorLeft.length-1))]
}
function getRandomWhoPidorRight() {
  return constants.whoPidorRight[Math.round(Math.random()*(constants.whoPidorRight.length-1))]
}
function getRandomTopPidorTop() {
  return constants.topPidorTop[Math.round(Math.random()*(constants.topPidorTop.length-1))]
}
function getRandomTopPidorLeader() {
  return constants.topPidorLeader[Math.round(Math.random()*(constants.topPidorLeader.length-1))]
}
function getRandomWrongCommand() {
  return constants.wrongCommand[Math.round(Math.random()*(constants.wrongCommand.length-1))]
}
function getRandomNotAdmin() {
  return constants.notAdmin[Math.round(Math.random()*(constants.notAdmin.length-1))]
}
function getRandomNotPidor() {
  return constants.notPidor[Math.round(Math.random()*(constants.notPidor.length-1))]
}
function getRandomLotterySelfVoting() {
  return constants.lotterySelfVoting[Math.round(Math.random()*(constants.lotterySelfVoting.length-1))]
}
function getRandomLotteryCantVote() {
  return constants.lotteryCantVote[Math.round(Math.random()*(constants.lotteryCantVote.length-1))]
}
function getRandomLoterySuccess() {
  return constants.loterySuccess[Math.round(Math.random()*(constants.loterySuccess.length-1))]
}
function getRandomSuccess() {
  return constants.success[Math.round(Math.random()*(constants.success.length-1))]
}


  module.exports = {findUsers, deleteAllPidors, uptatePidorTime,
                    toQuoteString, toSpoilerString, toCodeString, toBoldString,
                    getRandomWhoPidorLeft, getRandomWhoPidorRight, getRandomTopPidorTop, getRandomTopPidorLeader, getRandomWrongCommand,
                    markUser, checkRole, getRandomNotAdmin, getRandomNotPidor, getRandomLotterySelfVoting, getRandomLotteryCantVote,
                    getRandomLoterySuccess, getLotteryVote, getRandomSuccess}