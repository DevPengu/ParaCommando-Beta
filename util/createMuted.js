async function createMuted(muteRole, client, message) {
  // start of create role
  return;
  // DO NOT RUN THIS CODE IN ANY SERVER ATM BIG ERROR THAT WILL RENAME ALL CHANNELS TO "Muted"
  // if (!muteRole) {
  //   if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return message.reply('I do not have the correct permissions.');
  //   message.channel.send("I can't find a mute role. Creating one now");
  //   try {
  //     muteRole = await message.guild.roles.create({
  //       data: {
  //         name: 'Muted',
  //         color: '#000000',
  //         permissions: [],
  //       },
  //       reason: 'Missing mute role for mute command',
  //     });
  //     message.guild.channels.forEach(async (channel) => {
  //       await channel.overwritePermissions(muteRole, {
  //         SEND_MESSAGES: false,
  //         ADD_REACTIONS: false,
  //       });
  //     });
  //   } catch (e) {
  //     client.log.error(e.stack);
  //   }
  // }
  // // end of create role
  // return muteRole;
}

module.exports = { createMuted };
