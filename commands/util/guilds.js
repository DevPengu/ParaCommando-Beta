const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
// const oneLine = require('oneline');

module.exports = class GuildsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'guilds',
      // aliases: [],
      group: 'util',
      memberName: 'guilds',
      description: 'Shows the guilds the bot is in',
      examples: ['guilds'],
      ownerOnly: true,
      guildOnly: false,
      permissions: [],
      clientPermissions: [],
      // throttling: {},
      args: [],
    });
  }

  run(msg) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
   let e = new MessageEmbed()
   .setColor('BLUE')
   
    this.client.guilds.forEach(elem => {
      e.addField(`${elem}`, `**User Count**: ${elem.members.filter(mem => !mem.user.bot).size} \n**Bot Count**: ${elem.members.filter(mem => mem.user.bot).size} \n**Total**: ${elem.members.size} \n**Guild ID**: ${elem.id}`, true)
    })
   
   msg.say(e)
  }
};
