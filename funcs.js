let {users} = require('./db/epicdb.js');
let constants = require('./constants.json'); 
const {deleteAllPidorsFromGuild, getAllPidorsFromGuild, addPidorIfNotExist, getAllUsersFromGuild, updateUserTime} = require('./db/epicdb.js');

async function findUsers(guild) {
    let res = [];
    const members = await guild.members.fetch();
    const arr = members.array().filter((member) => !member.user.bot);
    for (key in arr) {
        res.push({user_id: arr[key].user.id, server_id: guild.id});
    }
    
    return res;
}

async function deleteAllPidors(guild) {
  const role = guild.roles.cache.find(role => role.name === "Пидор");
  //console.log("role", role);
  const cur_users = await getAllUsersFromGuild(guild.id);
  
  for (key of cur_users) {
      const usr = guild.members.cache.get(key.dataValues.user_id);
      //console.log("usr", usr);
      usr.roles.remove(role);
  }
}

async function uptateTimings(guild) {
  const now = Date.now();
  const pidors = await getAllPidorsFromGuild(guild.id);
  const cur_users = await getAllUsersFromGuild(guild.id);
  console.log("Pidors",JSON.stringify(pidors));
  console.log("cur users", JSON.stringify(cur_users));

  pidors.forEach(pidor => {
    cur_users.forEach(user => {
      if (pidor.user_id === user.user_id) {
        const pidorUpdatedDate = new Date(pidor.createdAt);
        const timeToPut = now - pidorUpdatedDate;
        //console.log(timeToPut);
        updateUserTime(guild.id, user.user_id, user.hours + timeToPut);
      }
    })
  })
}

async function uptatePidorTime(guild) {
  const now = Date.now();
  const pidors = await getAllPidorsFromGuild(guild.id);
  const cur_users = await getAllUsersFromGuild(guild.id);
  console.log("Pidors",JSON.stringify(pidors));
  console.log("cur users", JSON.stringify(cur_users));

  pidors.forEach(pidor => {
    cur_users.forEach(user => {
      if (pidor.user_id === user.user_id) {
        const pidorUpdatedDate = new Date(pidor.createdAt);
        const timeToPut = now - pidorUpdatedDate;
        //console.log(timeToPut);
        updateUserTime(guild.id, user.user_id, user.hours + timeToPut);
      }
    })
  })
}

async function setPidor(serverId, userId, role) {
  // ищем всех пидоров в гильдии и снимаем им роль
  const pidors = await getAllPidorsFromGuild(server_id);
  for (key of pidors) {
    pidors[key].roles.remove(role);
  }
  await deleteAllPidorsFromGuild(server_id);

  // добавляем пидора и даём ему роль
  const res = await addPidorIfNotExist({server_id: serverId, user_id: userId});
}

function checkRole(msg) {
  if (msg.member.permissions.has(["ADMINISTRATOR"])) {
    return "admin"
  }
  if (msg.member.roles.cache.find(role => role.name === "Пидор")) {
    return "pidor"
  }
  return "user"
}

 function toQuoteString(str) {
  return ">>> " + str;
}
 function toSpoilerString(str) {
  return "||" + str + "||";
}
 function toCodeString(str) {
  return "`" + str + "`";
}
 function toBoldString(str) {
  return "**" + str + "**";
}
function markUser(id) {
  return "<@" + id + ">";
}

function getRandomWhoPidorLeft() {
  return constants.whoPidorLeft[Math.round(Math.random()*(constants.whoPidorLeft.length-1))];
}
function getRandomWhoPidorRight() {
  return constants.whoPidorRight[Math.round(Math.random()*(constants.whoPidorRight.length-1))];
}
function getRandomTopPidorTop() {
  return constants.topPidorTop[Math.round(Math.random()*(constants.topPidorTop.length-1))];
}
function getRandomTopPidorLeader() {
  return constants.topPidorLeader[Math.round(Math.random()*(constants.topPidorLeader.length-1))];
}
function getRandomWrongCommand() {
  return constants.wrongCommand[Math.round(Math.random()*(constants.wrongCommand.length-1))];
}
function getRandomNotAdmin() {
  return constants.notAdmin[Math.round(Math.random()*(constants.notAdmin.length-1))];
}
function getRandomNotPidor() {
  return constants.notPidor[Math.round(Math.random()*(constants.notPidor.length-1))];
}


  module.exports = {findUsers, deleteAllPidors, uptatePidorTime,
                    toQuoteString, toSpoilerString, toCodeString, toBoldString,
                    getRandomWhoPidorLeft, getRandomWhoPidorRight, getRandomTopPidorTop, getRandomTopPidorLeader, getRandomWrongCommand,
                    markUser, checkRole, getRandomNotAdmin, getRandomNotPidor};