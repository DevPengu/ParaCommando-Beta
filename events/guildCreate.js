module.exports = async (client, guild) => {
  client.log.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);

  await client.sql.run('INSERT INTO guildSettings (guildID, prefix) VALUES (?)', [guild.id, 'c?']);
};
