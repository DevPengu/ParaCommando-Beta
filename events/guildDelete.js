module.exports = (client, guild) => {
  client.log.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);

  const dbNames = ['guildRoles', 'guildMembers', 'guildSettings'];
  for (let i = 0; i < dbNames.length; i += 1) {
    const tableName = dbNames[i];
    const row = client.sql.get(`SELECT * FROM ${tableName} WHERE guildID = '${guild.id}'`);
    try {
      if (!row) {
        client.log.log(`${guild.name} (${guild.id}) had no rows in ${tableName} db.`);
      } else {
        client.sql.run(`DELETE FROM ${tableName} WHERE guildID=${guild.id}`);
        client.log.log(`${guild.name} (${guild.id}) has been deleted from ${tableName} db.`);
      }
    } catch (e) {
      client.log.error(`[SQL] guildDelete - ${e}`);
    }
  }
};
