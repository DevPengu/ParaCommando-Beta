module.exports = (client) => {
  console.log(`Bot disconnected at ${new Date()}`);
  client.destroy();
};
