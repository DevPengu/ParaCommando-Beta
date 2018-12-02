const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      group: 'modcmds',
      memberName: 'say',
      description: 'Replies with text (provided by you)',
      examples: ['say Hello ParaCommando'],
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 60,
      },
      permissions: ['MANAGE_MESSAGES', 'MANAGE_SERVER'],
      ownerOnly: true,
      args: [
        {
          key: 'text',
          prompt: 'What would you like me to say?',
          type: 'string',
          validate: (text) => {
            if (text.length < 201) return true;
            return 'Your message cannot be more than 200 characters!';
          },
        },
      ],
    });
  }

  run(msg, { text }) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
    msg.delete();
    msg.say(text);
  }
};
