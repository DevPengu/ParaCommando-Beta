const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      group: 'modcmds',
      memberName: 'ban',
      description: 'Bans the mentioned user',
      examples: ['ban User#1234 being bad'],
      permissions: ['BAN_MEMBERS', 'VIEW_AUDIT_LOG'],
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Who would you like me to ban?',
          type: 'user',
        },
        {
          key: 'reason',
          prompt: 'Please provide a reason.',
          type: 'string',
        },
      ],
    });
  }

  run(msg, { user, reason }) {
    const e = new MessageEmbed()
      .setColor('RED')
      .setTitle('User Ban')
      .addField('Banned user', `${user.tag} (${user.id})`)
      .addField('Reason', `${reason}`)
      .addField('Time', `${msg.createdAt}`)
      .addField('Banned by', msg.author.tag);

    user.send(`You were banned from **${msg.guild.name}** for **${reason}**`);
    msg.guild.member(user).ban(`User was banned by ${msg.author.username} for: ${reason}`);
    msg.delete();
    msg.say(`**${user.username}** has been banned for **${reason}**`);
    const channel = msg.guild.channels.get('510242247166525450');
    channel.send(e);
  }
};
