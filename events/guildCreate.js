const oneline = require('oneline');

module.exports = async (client, guild) => {
  client.log.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);
  if(guild.id === '446783497500229632'){
    guild.leave();
    console.log(`[BLACKLIST] Left a blacklisted guild!`)
  }
  await client.sql.run('INSERT INTO guildSettings (guildID, prefix) VALUES (?,?)', [guild.id, 'c?']);
};
