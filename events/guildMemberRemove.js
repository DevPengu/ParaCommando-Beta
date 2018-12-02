const { MessageEmbed } = require('discord.js');

module.exports = async (client, member) => {
  // Remove user from sql
  // client.sql.run(`DELETE FROM guildMembers WHERE guildID = '${member.guild.id}' AND userID = '${member.user.id}'`);
  const channelID = await client.sql.get(`SELECT * FROM guildSettings WHERE guildID = '${member.guild.id}'`);
  if (!channelID) return;
  if (channelID.welcomeEnable === 0) return;
  // if (member.guild.id !== '509877095988723743') return;
  const channel = member.guild.channels.get(channelID.welcomeChannel);

  const leaveEmbed = new MessageEmbed()
    .setColor('RANDOM')
    .setAuthor(member.user.tag, member.user.displayAvatarURL())
    .setDescription(`Goodbye, we hope you had a great time at ${member.guild.name}!`);
  channel.send(leaveEmbed);
};
