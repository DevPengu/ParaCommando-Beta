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
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
    let totalSeconds = (this.client.uptime / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let uptime = `${hours} hours, ${minutes} minutes and ${Math.floor(seconds)} seconds`;

    
    const e = new MessageEmbed()
      .setColor('BLUE')
      .setAuthor('ParaCommando Information!')
      .setDescription('ParaCommando was created to be a highly configurable alternative to most popular bots. \n \nIf you would like to join our support server, click [here](https://discord.gg/c36U6wv) \n \nIf you would like to invite the bot to your own server, click [here](https://discordapp.com/oauth2/authorize?client_id=488395833331548161&scope=bot&permissions=8) (Admin Permission) or [here](https://discordapp.com/oauth2/authorize?client_id=488395833331548161&scope=bot&permissions=536985792) (Normal Permissions). \n \nIt is highly recommended that you use the Admin permission invite to avoid any unwanted behavior.')
      .setFooter(`Uptime : ${uptime}`)
    msg.reply(e);
  }
};
