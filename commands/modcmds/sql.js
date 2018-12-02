const { Command } = require('discord.js-commando');

module.exports = class SetCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sql',
      group: 'modcmds',
      memberName: 'sql',
      description: 'Run sql command',
      examples: ['sql command'],
      ownerOnly: true,
      guildOnly: true,
      permissions: ['MANAGE_SERVER'],
      clientPermissions: [],
      args: [
        {
          key: 'type',
          prompt: 'SQL type.',
          type: 'string',
        },
        {
          key: 'command',
          prompt: 'Write command.',
          type: 'string',
        },
      ],
    });
  }

  async run(msg, { type, command }) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
    if (type === 'run') {
      this.client.log.log(command);
      await this.client.sql.run(`${command}`);
      msg.say('SQL code complete')
    } else if (type === 'get') {
      this.client.log.log(command);
      const sqlData = await this.client.sql.get(`${command}`);
      const sqlArray = Object.entries(sqlData);

      const newArray = [];
      for (let i = 0; i < sqlArray.length; i += 1) {
        const test = sqlArray[i];
        const test1 = `${test[0]}: ${test[1]}`;
        newArray.push(test1);
      }
      msg.say(`\`\`\`${newArray.join('\n')}\`\`\``);
    }
  }
};
