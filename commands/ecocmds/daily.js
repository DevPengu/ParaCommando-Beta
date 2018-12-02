const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class DailyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'daily',
      group: 'ecocmds',
      memberName: 'daily',
      description: 'Receive your daily coins!',
      examples: ['daily'],
      throttling: {
        usages: 1,
        duration: 86400,
      },
      guildOnly: true,
    });
  }

  async run(msg) {
    this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    // return msg.say('This command is under maintenance, please try again later.')
    this.client.sql.run(`UPDATE guildMembers SET coins = coins + 15 WHERE guildID = '${msg.guild.id}' AND userID = '${msg.author.id}'`);

    const e = new MessageEmbed()
      .setColor('GREEN')
      .setTitle('You have recieved your daily 15 coins!')
      .setAuthor(msg.author.username, msg.author.displayAvatarURL());
    msg.say(e);
  }
};
