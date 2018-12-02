/* eslint-disable func-names, no-restricted-syntax, guard-for-in, no-extend-native, no-shadow */
// sql.run('INSERT INTO userScores (guildID, userID, username, currXp, nextPL, uLevel, weeklyXp, globalRank, weeklyRank, totalXp, awardedXp) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [message.guild.id, message.author.id, message.author.username, 3, 36, 0, 3, 0, 0, 3, 0]);

const { MessageEmbed } = require('discord.js');
const packageFile = require('../package.json');

function levelUpEmbed(client, message, level) {
  console.log(`${message.author.id} level up`);
  const embed = new MessageEmbed()
    .setTitle(message.author.username)
    .setDescription(`**CONGRATS**\nYou are now level **${level}**!`)
    .setColor('GREEN')
    .setThumbnail(message.author.displayAvatarURL());
  message.channel.send({ embed });
}

// LevelSystem's Timer
const xpTalkedRecently = new Set();

module.exports = (client) => {
  // Xp Monitor
  client.levelMonitor = (client, message) => {
    if (message.channel.type !== 'text') return;

    client.sql.all(`SELECT * FROM guildRoles WHERE guildID = '${message.guild.id}' AND blacklist = ${1}`).then((rCheck) => {
      const blRoles = rCheck.map(g => g.roleID);
      if (message.member.roles.some(r => blRoles.includes(r.id))) {
        return;
      }
      if (xpTalkedRecently.has(message.author.id)) return;

      client.scoreSystem(client, message);
      xpTalkedRecently.add(message.author.id);
      setTimeout(() => {
        // Removes the user from the set after 5 min
        xpTalkedRecently.delete(message.author.id);
      }, 300000);
    });
  };

  client.scoreSystem = (client, message) => {
    client.sql.get(`SELECT * FROM guildMembers WHERE guildID = '${message.guild.id}' AND userID = '${message.author.id}'`).then((row) => {
      const newExp = 3;
      const curXp = row.currXp + newExp;

      if (curXp >= row.nextPL) {
        const nPLE = row.nextPL + 9;
        const newXp = curXp - row.nextPL;
        client.sql.run(`UPDATE guildMembers SET currXp = ${newXp}, totalXp=${row.totalXp + newExp}, weeklyXp=${row.weeklyXp + newExp}, uLevel = ${row.uLevel + 1}, nextPL = ${nPLE} WHERE userID=${message.author.id} AND guildID=${message.guild.id}`);
        levelUpEmbed(client, message, row.uLevel + 1);
      } else {
        // Check this might need to be above /\
        client.levelRank(client, message); // FOR LEVEL/RANK IMPLEMENTS
        client.sql.run(`UPDATE guildMembers SET currXp = ${row.currXp + newExp}, totalXp = ${row.totalXp + newExp}, weeklyXp = ${row.weeklyXp + newExp} WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`);// updates Xp
      }
      // client.levelRank(client, message); // FOR LEVEL/RANK IMPLEMENTS
      client.sql.all(`SELECT userID FROM guildMembers WHERE guildID = '${message.guild.id}' ORDER BY totalXp DESC`).then((rColumns) => {
        const setRankUsers = rColumns.map(z => z.userID);
        let i = 0;
        while (setRankUsers[i]) {
          client.sql.run(`UPDATE guildMembers SET globalRank = ${i + 1} WHERE userID=${setRankUsers[i]} AND guildID=${message.guild.id}`);
          i += 1;
        }// while loop end
      });
    });// sql
  };

  client.levelRank = (client, message) => {
    client.sql.get(`SELECT * FROM guildMembers WHERE guildID = '${message.guild.id}' AND userID = '${message.author.id}'`).then((rlch) => {
      client.sql.get(`SELECT * FROM guildRoles WHERE guildID = '${message.guild.id}' AND levelRole = ${1} AND level = ${rlch.uLevel}`).then((grank) => {
        if (!grank) {
          return;
        }
        const role = message.guild.roles.get(grank.roleID);
        if (message.member.roles.has(role.id)) {
          return;
        }
        message.member.addRole(role);
      }).catch((err) => {
        client.log.error(err);
      });
    }).catch((err) => {
      client.log.error(err);
    });
  };

  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };


  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == 'Promise') { text = await text; } // eslint-disable-line eqeqeq
    if (typeof evaled !== 'string') { text = require('util').inspect(text, { depth: 1 }); }

    text = text
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
      .replace(/\n/g, `\n${String.fromCharCode(8203)}`)
      .replace(client.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');
    // .replace(client.config.token, 'mfa.VkO_2G4Qv3T-- NO TOKEN HERE --');
    return text;
  };

  /* MISCELLANEOUS NON-CRITICAL FUNCTIONS */

  // <String>.toPropercase() returns a proper-cased string such as:
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require('util').promisify(setTimeout);

  client.version = packageFile.version;

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  /*
  process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    client.log.error(`Uncaught Exception: ${errorMsg}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    client.log.error(`Unhandled rejection: ${err}`);
  });*/
};
