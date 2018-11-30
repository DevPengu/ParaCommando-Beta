module.exports = async (client) => {
  client.log.log('Logged in!');
  client.user.setActivity('c? | v1.0', { type: 'WATCHING' });
};
