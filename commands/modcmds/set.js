const { Command } = require('discord.js-commando');
// const { MessageEmbed } = require('discord.js');

module.exports = class SetCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'set',
      group: 'modcmds',
      memberName: 'set',
      description: 'Change a users stats',
      examples: ['set coins 100', 'set level 5', 'set reset', 'set coins 100 @User#1234'],
      ownerOnly: true,
      guildOnly: true,
      permissions: ['MANAGE_SERVER'],
      clientPermissions: [],
      args: [
        {
          key: 'type',
          prompt: 'Please choose from coins, level, or reset.',
          type: 'string',
          oneOf: ['coins'],
        },
        {
          key: 'amount',
          prompt: 'What would you like me to set it to?',
          type: 'integer',
          max: 99999,
        },
        {
          key: 'user',
          prompt: 'Please include a user.',
          type: 'user',
          default: '',
        },
      ],
    });
  }

  run(msg, { type, amount, user }) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
    let gUser = user;
    if (!gUser) gUser = msg.author;

    if (type === 'coins') {
      this.client.sql.run(`UPDATE guildMembers SET coins = ${amount} WHERE guildID = '${msg.guild.id}' AND userID = '${gUser.id}'`);
      msg.say(`Set **${gUser.tag}'s** coins to **${amount}**`);
    }
  }
};
