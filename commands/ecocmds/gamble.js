const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class GambleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gamble',
      aliases: ['bet'],
      group: 'ecocmds',
      memberName: 'gamble',
      description: 'Win or lose coins!',
      examples: ['gamble 23'],
      ownerOnly: false,
      guildOnly: true,
      permissions: [],
      clientPermissions: [],
      throttling: {
        usages: 1,
        duration: 300,
      },
      args: [
        {
          key: 'amount',
          prompt: 'How much would you like to gamble (coins)?',
          type: 'integer',
          max: 25,
        },
      ],
    });
  }

  embed(msg, amount, color, symbol, text) {
    const e = new MessageEmbed()
      .setColor(color)
      .setTitle(`${symbol}${amount}`)
      .setDescription(text)
      .setAuthor(msg.author.username, msg.author.displayAvatarURL());
    msg.say(e);
  }

  async run(msg, { amount }) {
    this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    const currCoins = await this.client.sql.get(`SELECT coins FROM guildMembers WHERE guildID = '${msg.guild.id}' AND userID = '${msg.author.id}'`);
    if (currCoins.coins < amount) return msg.say(`You dont have enough coins. Current coins ${currCoins.coins}`);
    const chance = Math.random();

    if (chance >= 0.45) {
      await this.client.sql.run(`UPDATE guildMembers SET coins = ${currCoins.coins + amount} WHERE guildID = '${msg.guild.id}' AND userID = '${msg.author.id}'`);
      return this.embed(msg, amount, 'GREEN', '+', 'Congratulations, you won the bet!');
    }
    await this.client.sql.run(`UPDATE guildMembers SET coins = ${currCoins.coins - amount} WHERE guildID = '${msg.guild.id}' AND userID = '${msg.author.id}'`);
    return this.embed(msg, amount, 'RED', '-', 'Unfortunately, you lost the bet!');
  }
};
