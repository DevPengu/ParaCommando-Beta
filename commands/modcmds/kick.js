const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      group: 'modcmds',
      memberName: 'kick',
      description: 'Kicks a user with added reason.',
      examples: ['kick @ParaCommando#4826 being bad'],
      guildOnly: true,
      permissions: ['KICK_MEMBERS', 'VIEW_AUDIT_LOG'],
      args: [
        {
          key: 'user',
          prompt: 'Who would you like me to kick?',
          type: 'user',
        },
        {
          key: 'reason',
          prompt: 'Please supply a reason!',
          type: 'string',
        },
      ],
    });
  }

  run(msg, { user, reason }) {
    msg.delete();
    msg.say(`Kicked **${user.username}** for **${reason}**`);

    const e = new MessageEmbed()
      .setColor('RED')
      .setTitle('User Kick')
      .addField('Kicked User', user.username)
      .addField('Reason', reason)
      .addField('Channel', msg.channel.name);

    const channel = msg.guild.channels.get('510242247166525450');

    msg.guild.member(user).kick(reason);
    channel.send(e);
  }
};
