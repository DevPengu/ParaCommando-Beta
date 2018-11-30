const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      aliases: ['bi'],
      group: 'gencmds',
      memberName: 'botinfo',
      description: 'Replies with information about the bot.',
      examples: ['botinfo', 'bi'],
      ownerOnly: false,
      guildOnly: false,
      permissions: [],
      clientPermissions: [],
      args: [],
    });
  }

  run(msg) {
    const e = new MessageEmbed()
      .setColor('BLUE')
      .setAuthor('ParaCommando Information!')
      .addField('General Information', '**ParaCommando** was created as an Economic alternative to the original ParaBot, allowing us the go all out with the economy system.')
      .setFooter('No new information at this time.');
    msg.reply(e);
  }
};
