const { MessageEmbed } = require('discord.js');
// const noswears = require('no-swears');

const blacklistedUsers = [
  '396701814126411786',
];

async function msgReward(client, message, cUser, messages, coins) {
  const tEmbed = new MessageEmbed()
    .setColor('GREEN')
    .setTitle(`CONGRATS ON ${messages} MESSAGES!`)
    .setDescription(`As a token of our appreciation, we have added ${coins} coins to your balance!`)
    .setAuthor(cUser.username, cUser.displayAvatarURL());

  await client.sql.run(`UPDATE guildMembers SET coins = coins + ${coins} WHERE guildID = '${message.guild.id}' AND userID = '${cUser.id}'`);
  message.channel.send(tEmbed).then(m => m.delete({ timeout: 20000 }));
}

module.exports = async (client, message) => {
  if (message.author.id === client.user.id) return;
  // if (message.guild.id !== '509877095988723743') return;
  if (message.channel.id === '510244534203056128') {
    if (message.content !== 'accept') message.delete();
    else {
      message.member.roles.remove('510219747887939585');
      message.member.roles.add('510176139835211777');
      message.author.send(`Welcome to ${message.guild.name}! \nPlease have a wonderful stay! \n \nIf you would like to use my commands, please type \`help\` (in this DM channel) or \`c?help\` in the server. `);
    }
  }

  // Had to disable this event in DM since it trows alot of errors since you are trying to grap guild.id - Pengu
  if (message.channel.type === 'dm') return;

  let settings = client.sql.get(`SELECT * FROM guildSettings WHERE guildID = '${message.guild.id}'`);
  if (!settings) {
    await client.sql.run('INSERT INTO guildSettings (guildID, prefix) VALUES (?,?)', [message.guild.id, 'c?']);
    settings = await client.sql.get(`SELECT * FROM guildSettings WHERE guildID = '${message.guild.id}'`);
  }

  let msgAmount = 1;
  let newCoins = 0;

  const amount = Math.floor(Math.random() * 20);
  const chance = Math.random();
  if (chance >= 0.98) {
    const winEmbed = new MessageEmbed()
      .setColor('GREEN')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`You have gained +${amount} coins!`);
    newCoins = amount;
    message.channel.send(winEmbed).then((m) => {
      m.delete({ timeout: 10000 });
    });
  }

  await client.sql.get(`SELECT * FROM guildMembers WHERE guildID = '${message.guild.id}' AND userID = '${message.author.id}'`).then(async (row) => {
    if (!row) {
      await client.sql.run('INSERT INTO guildMembers (guildID, userID, coins, messages) VALUES (?,?,?,?)', [message.guild.id, message.author.id, amount, msgAmount]);
    } else {
      msgAmount += row.messages;
      newCoins += row.coins;
      await client.sql.run(`UPDATE guildMembers SET messages = ${msgAmount}, coins = ${newCoins} WHERE guildID = '${message.guild.id}' AND userID = '${message.author.id}'`);
    }
  });
  client.levelMonitor(client, message);

  if (blacklistedUsers.includes(message.author.id)) return;
  if (message.author.bot) return;
  const cUser = message.author;

  //  now the user can win 0-20 when both numbers are same

  // let chance2 = Math.floor(Math.random()* 20)
  // console.log(chance + ":" + chance2)
  // if(chance == chance2){
  //   let winEmbed = new MessageEmbed()
  //   .setColor('GREEN') .setAuthor(message.author.username, message.author.displayAvatarURL())
  //   .setTitle(`You have gained +${chance} coins!`)
  //   global.stats.add(`${message.author.id}.coins`, amount)
  //   message.channel.send(winEmbed).then(m => {
  //     m.delete({timeout: 10000})
  //   })
  // }

  if (msgAmount === 500) {
    msgReward(client, message, cUser, 500, 50);
  }

  if (msgAmount === 1000) {
    msgReward(client, message, cUser, 1000, 100);
  }
};
