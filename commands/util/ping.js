const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      group: 'util',
      memberName: 'ping',
      description: 'Ping me!',
      examples: ['ping'],
      ownerOnly: false,
      guildOnly: false,
      permissions: [],
      clientPermissions: [],
      args: [],
    });
  }

  run(msg) {
    msg.say('Checking Latency...').then((m) => {
      const e = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('PONG!')
        .addField('API Latency', `**${Math.floor(this.client.ws.ping)}ms**`, true)
        .addField('Client Latency', `**${m.createdTimestamp - msg.createdAt}ms**`, true);
      m.edit(e);
    });
  }
};
