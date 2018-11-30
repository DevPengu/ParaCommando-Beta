/* eslint-disable no-else-return */
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const cfg = require('../../storecfg.js');

module.exports = class StoreCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'store',
      aliases: ['shop'],
      group: 'ecocmds',
      memberName: 'store',
      description: 'Shop Menu',
      guildOnly: true,
      ownerOnly: true,
      permissions: [],
      args: [],
    });
  }

  successEmbed(item, coins) {
    const embed = new MessageEmbed()
      .setDescription(`Successfully bought ${item.name}`)
      .setFooter(`Your new balance is: ${coins}`);
    return embed;
  }

  failEmbed(err) {
    const embed = new MessageEmbed()
      .setDescription(err);
    return embed;
  }

  async run(msg) {
    const userStats = await this.client.sql.get(`SELECT coins, uLevel FROM guildMembers WHERE guildID = '${msg.guild.id}' AND userID = '${msg.author.id}'`);
    const userCoins = userStats.coins;
    const userLevel = userStats.uLevel;

    const storeEmbed = new MessageEmbed()
      .setColor('BLUE')
      .setAuthor('Welcome to the ParaShop')
      .setDescription(`You have ${userCoins} coins & your level is ${userLevel}.`)
      .setFooter('Use **c?buy <id number>** to buy the item you want');
    const items = cfg;

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.type === 'level' && item.level === userLevel.toString()) {
        storeEmbed.addField(`${item.ID}. ${item.name}`, `Price ${item.cost}`);
      } else if (item.type !== 'level') {
        storeEmbed.addField(`${item.ID}. ${item.name}`, `Price ${item.cost}`);
      }
    }

    const shopMSG = await msg.direct(storeEmbed);
    if (msg.channel.type !== 'dm') msg.reply('check your DMs');
    const filter = m => m.author.id === msg.author.id;
    const collector = shopMSG.channel.createMessageCollector(filter, { time: 30000 });
    collector.on('collect', async (m) => {
      if (m.content.toLowerCase() === 'cancel') {
        collector.stop();
        return msg.direct('You have cancled');
      }
      const itemID = m.content;
      let item;
      for (let i = 0; i < cfg.length; i += 1) {
        const temp = cfg[i];
        if (temp.id === itemID) {
          item = temp;
          break;
        }
      }
      if (!item) return msg.direct('Choice one from the shoplist');
      // if ((itemID <= 0) || (itemID > items.length)) return msg.direct(`Choice between 1 and ${items.length}`);
      if (userCoins < item.cost) return msg.direct(this.failEmbed(`Insufficient amount of coins to buy ${item.name}`));
      if (userLevel < item.level) return msg.direct(this.failEmbed(`Insufficient level to buy ${item.name}`));
      if (item.type === 'level' && userLevel !== item.level) return msg.direct(this.failEmbed(`You can't buy ${item.name}`));
      try {
        let role;
        const guild = this.client.guild.get('509877095988723743');
        const guildUser = await guild.fetchMember(msg.author.id);

        if (item.type !== 'nick') role = guild.roles.get(item.value);

        if (item.type === 'level') {
          return msg.direct(this.failEmbed('The level roles is disabled because of Level rebuild'));
          // global.stats.add(`${msg.author.id}.level`, item.level + 1);
          // guildUser.addRole(role);
        } else if (item.type === 'role') {
          if (guildUser.roles.has(item.value)) return msg.direct(this.failEmbed('You have already bought this item'));
          guildUser.addRole(role);
        } else if (item.type === 'nick') {
          msg.direct('Please type the new nick you want').then((nickMSG) => {
            nickMSG.channel.awaitMessages(response => response.content, {
              max: 1,
              time: 30000,
              errors: ['time'],
            }).then((collected) => {
              const newNick = collected.first().content;
              guildUser.setNickname(newNick);
            }).catch(() => {
              const errorEmbed = new MessageEmbed()
                .setAuthor('An Error Occured')
                .setDescription('It looks like you haven\'t responded in a while.');
              return msg.direct(errorEmbed);
            });
          });
        }
        this.client.sql.run(`UPDATE guildMembers SET coins = coins - ${item.cost} WHERE guildID = '${msg.guild.id}' AND userID = '${msg.author.id}'`);
        const coins = userCoins - item.const;
        collector.stop();
        return msg.direct(this.successEmbed(item, coins));
      } catch (err) {
        return this.client.log.warn(err);
      }
    });
  }
};
