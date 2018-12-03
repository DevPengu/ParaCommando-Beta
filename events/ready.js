module.exports = async (client) => {
  client.log.log(`${client.user.username} is now active on ${client.guilds.size} guilds.`);
  const statuses = [
    `${client.guilds.size} guild(s)!`,//When you try your best but you don't suceeeeeed
    `${client.users.filter(u => u.bot !== true).size - client.guilds.get('264445053596991498').members.filter(m => m.user.bot !== true).size} users!`,
  ];
  // client.user.setActivity(statuses[0], { type: 'WATCHING' });
  setInterval(() => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setActivity(status, { type: 'WATCHING' });
  }, 10000);
};
