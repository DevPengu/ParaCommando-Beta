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
      guarded: true,
    });
  }

  run(msg) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
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
