const { Command } = require('discord.js-commando');
// const { MessageEmbed } = require('discord.js');

module.exports = class WelcomerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'welcomer',
      aliases: ['welcome'],
      group: 'rolecmds',
      memberName: 'welcomer',
      description: 'Assign yourself to the welcomer role.',
      examples: ['welcomer'],
      ownerOnly: false,
      guildOnly: true,
      permissions: [],
      clientPermissions: [],
      // throttling: {},
      args: [],
    });
  }

  run(msg) {
    msg.member.roles.add('514958519246520332')
      .then(() => {
        msg.reply('You will now receive welcome notifications!');
      });
  }
};
