const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      aliases: ['si', 'server-info'],
      group: 'gencmds',
      memberName: 'serverinfo',
      description: 'Replies with info about the current server',
      examples: ['serverinfo', 'si', 'server-info'],
      guildOnly: true,
    });
  }

  run(msg) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
    const mCount = msg.guild.members.filter(mem => !mem.user.bot);
    const bCount = msg.guild.members.filter(mem => mem.user.bot);

    const e = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(`**${msg.guild.name}** Server Information`)
      .addField('Members', mCount.size)
      .addField('Bots', bCount.map(m => m.user.tag))
      .addField('Total', msg.guild.members.size)
      .addField('Channels', msg.guild.channels.size)
      .addField('Roles', msg.guild.roles.map(r => r).join(', '))
      .addField('Your Roles', msg.member.roles.map(r => r).join(', '))
      .addField('Key Permissions', msg.member.permissions.toArray().map(p => p).join(', '));
    msg.say(e);
  }
};
