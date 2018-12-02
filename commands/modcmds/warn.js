const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { parseUser } = require('../../util/parseUser.js');
// const { createMuted } = require('../../util/createMuted.js');

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      group: 'modcmds',
      memberName: 'warn',
      description: 'Warn users with reason',
      examples: ['warn @user#1234 spam'],
      ownerOnly: false,
      guildOnly: true,
      permissions: ['VIEW_AUDIT_LOG'],
      clientPermissions: [],
      args: [
        {
          key: 'user',
          prompt: 'Who should I warn?',
          type: 'user',
        },
        {
          key: 'reason',
          prompt: 'Please include a reason for the warn',
          type: 'string',
        },
      ],
    });
  }

  covertStringToArray(string) {
    const stringSep = '__,__';
    const array = string.split(stringSep);
    return array;
  }

  convertArrayToString(array) {
    const stringSep = '__,__';
    let string = '';
    for (let index = 0; index < array.length; index += 1) {
      string += array[index];
      if (index < array.length - 1) {
        string += stringSep;
      }
    }
    return string;
  }

  async run(msg, { user, reason }) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
    const settings = await this.client.sql.get(`SELECT * FROM guildSettings WHERE guildID = '${msg.guild.id}'`);
    const logChannel = msg.guild.channels.find(channel => channel.name === settings.modLogChannel);
    if (!logChannel) return msg.channel.send(`Could not locate ${settings.modLogChannel} channel!\nPlease create a channel called ${settings.modLogChannel}`);
    const parseChecker = parseUser(msg, user);
    if (parseChecker === true) return false;
    // let muteRole = msg.guild.roles.find(role => role.name === 'Muted');
    // if (!muteRole) {
    //  muteRole = await createMuted(muteRole, this.client, msg);
    // }
    msg.delete().catch((e) => { this.client.log.warn(e); });

    const userWarn = await this.client.sql.get(`SELECT * FROM guildMembers WHERE guildID = '${msg.guild.id}' AND userID = '${user.id}'`);

    let warnings = 1;
    let newWarnReason = reason;
    if (userWarn.warns > 0) {
      newWarnReason = `${userWarn.warnReason}__,__${reason}`;
      this.client.log.log(`This is simple: ${newWarnReason}`);
      warnings += userWarn.warns;
      // const warnReason = await this.covertStringToArray(userWarn.warnReason);
      // warnReason.push(reason);
      // newWarnReason = await this.convertArrayToString(warnReason);
      // console.log(`This is complicated: ${newWarnReason}`);
    }
    await this.client.sql.run(`UPDATE guildMembers SET warns = ${warnings}, warnReason = '${newWarnReason}' WHERE guildID = '${msg.guild.id}' AND userID = '${user.id}'`);

    const embed = new MessageEmbed()
      .setAuthor(`Warned | ${user.tag} (${user.id})`)
      .setColor('BLUE')
      .setDescription('   ‍   ')
      .addField('User', `${user.tag}`, true)
      .addField('Moderator', `${msg.author.tag}`, true)
      .addField('Warnings', warnings, true)
      .addField('Reason', reason)
      .setTimestamp()
      .setFooter(`${user.tag} was warned`);
    msg.say(`**${user.username}** has been warned for **${reason}**`);
    return logChannel.send(embed);
  }
};
