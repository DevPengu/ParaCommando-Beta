const { Command } = require('discord.js-commando');
// const { MessageEmbed } = require('discord.js');

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clear',
      aliases: ['prune', 'delete'],
      group: 'modcmds',
      memberName: 'clear',
      description: 'Clear up to 100 messages (must be under 2 weeks old)',
      examples: ['clear 100', 'prune 50', 'delete 25'],
      ownerOnly: false,
      guildOnly: true,
      guarded: true,
      permissions: ['MANAGE_MESSAGES', 'VIEW_AUDIT_LOG'],
      clientPermissions: [],
      // throttling: {},
      args: [
        {
          key: 'amount',
          prompt: 'How many messages would you like to delete?',
          type: 'integer',
          max: 100,
          min: 0,
        },
      ],
    });
  }

  run(msg, { amount }) {
    msg.delete();
    msg.channel.bulkDelete(amount).catch(err => msg.say(err.message));
    msg.say(`Cleared ${amount} messages...`).then(m => m.delete({ timeout: 5000 }));
  }
};
