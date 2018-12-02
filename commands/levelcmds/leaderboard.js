const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class LeaderBoardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      aliases: ['lb', 'leaders'],
      group: 'levelcmds',
      memberName: 'leaderboard',
      description: 'View the leaderboards for your current server and see who is on top.',
      examples: ['leaderboard'],
      guildOnly: true,
    });
  }

  embed(msg, user, iUser) {
    const embed = new MessageEmbed()
      .setTitle(user.username)
      .setDescription(`**Level:** ${iUser.uLevel} \n**Exp:** ${iUser.currXp} / ${iUser.nextPL}\n**Rank:** ${iUser.globalRank}`)
      .setColor('GREEN')
      .setThumbnail(user.displayAvatarURL());
    msg.channel.send({ embed });
  }

  async run(msg) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
    this.client.sql.all(`SELECT * FROM guildMembers WHERE guildID = '${msg.guild.id}' ORDER BY totalXp DESC LIMIT 5`).then(async (gLeader) => {
      let leadOut;
      if (!gLeader[0]) {
        leadOut = 'Sorry there is no leaderboards yet. Start chatting!';
      } else {
        const lUser = await gLeader.map(z => this.client.users.get(z.userID).username);
        const lLvl = gLeader.map(c => c.uLevel);
        const lCurXp = gLeader.map(v => v.currXp);

        const leadOutp = lUser.map((a, b) => {
          const s = b + 1;
          return [`${s}. ${a}\nLevel ${lLvl[b]} - ${lCurXp[b]}xp`];
        });
        leadOut = leadOutp.join('\n');
      }
      const embed = new MessageEmbed()
        .setColor(0x00AE86)
        .addField(`**${msg.guild.name}** XP Leaderboard`, `${leadOut}`, true);
      msg.say({ embed });
    });
  }
};
