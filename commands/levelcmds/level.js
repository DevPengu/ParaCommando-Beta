const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class LevelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'level',
      aliases: ['lvl'],
      group: 'levelcmds',
      memberName: 'level',
      description: 'Check your (or another user\'s) level',
      examples: ['level', 'level @ParaCommando#4826'],
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Whose level would you like to check?',
          type: 'user',
          default: '',
        },
      ],
    });
  }

  embed(msg, user, iUser) {
    const embed = new MessageEmbed()
      .setTitle(user.username)
      .setDescription(`**Level:** ${iUser.uLevel} \n**Exp:** ${iUser.currXp} / ${iUser.nextPL}\n**Rank:** ${iUser.globalRank}`)
      .setColor('GREEN')
      .setThumbnail(user.displayAvatarURL());
    msg.channel.send({ embed });
  }

  async run(msg, { user }) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
    if (!user) {
      const c = await this.client.sql.get(`SELECT * FROM guildMembers WHERE guildID = '${msg.guild.id}' AND userID = '${msg.author.id}'`);
      this.embed(msg, msg.author, c);
    } else {
      const c = await this.client.sql.get(`SELECT * FROM guildMembers WHERE guildID = '${msg.guild.id}' AND userID = '${user.id}'`);
      this.embed(msg, user, c);
    }
  }
};
