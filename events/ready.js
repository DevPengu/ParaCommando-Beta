module.exports = async (client) => {
  client.log.log(`${client.user.username} is now active on ${client.guilds.size} guilds.`);
  const statuses = [
    `${client.guilds.size} guild(s)!`,
  ];
  client.user.setActivity(statuses[0], { type: 'WATCHING' });
  // setInterval(() => {
  //   const status = statuses[Math.floor(Math.random() * statuses.length)];
  //   client.user.setActivity(status, { type: 'WATCHING' });
  // }, 10000);
};
