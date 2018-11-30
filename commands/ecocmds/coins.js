const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class CoinsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'coins',
      aliases: ['wallet', 'balance', 'bank'],
      group: 'ecocmds',
      memberName: 'coins',
      description: 'Check your (or another user\'s) coins',
      examples: ['coins', 'coins @ParaCommando#4826'],
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Whose coins would you like to check?',
          type: 'user',
          default: '',
        },
      ],
    });
  }

  embed(user, msg, c) {
    const e = new MessageEmbed()
      .setColor('BLUE')
      .setAuthor(user.username, user.displayAvatarURL())
      .setDescription(`${user.username} have ${c} coins!`);
    msg.say(e);
  }

  async run(msg, { user }) {
    if (!user) {
      const c = await this.client.sql.get(`SELECT coins FROM guildMembers WHERE guildID = '${msg.guild.id}' AND userID = '${msg.author.id}'`);
      this.embed(msg.author, msg, c.coins);
    } else {
      const c = await this.client.sql.get(`SELECT coins FROM guildMembers WHERE guildID = '${msg.guild.id}' AND userID = '${user.id}'`);
      this.embed(user, msg, c.coins);
    }
  }
};
