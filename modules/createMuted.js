async function createMuted(muteRole, client, message) {
  // start of create role
  if (!muteRole) {
    if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return message.reply('I do not have the correct permissions.');
    message.channel.send("I can't find a mute role. Creating one now");
    try {
      muteRole = await message.guild.createRole({
        name: 'Muted',
        color: '#000000',
        permissions: [],
      });
      message.guild.channels.forEach(async (channel) => {
        await channel.overwritePermissions(muteRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
        });
      });
    } catch (e) {
      client.log.error(e.stack);
    }
  }
  // end of create role
  return muteRole;
}

module.exports = { createMuted };
