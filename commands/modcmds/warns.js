const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class WarnsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warns',
      group: 'modcmds',
      memberName: 'warns',
      description: 'Check a user\'s warn count.',
      examples: [''],
      ownerOnly: true,
      guildOnly: true,
      permissions: ['VIEW_AUDIT_LOG'],
      clientPermissions: [],
      // throttling: {},
      args: [
        {
          key: 'user',
          prompt: 'Who would you like me to check?',
          type: 'user',
        },
        {
          key: 'incident',
          prompt: 'Which incident would you like to check?',
          type: 'integer',
          default: '',
        },
      ],
    });
  }

  covertStringToArray(string) {
    const stringSep = '__,__';
    const array = string.split(stringSep);
    return array;
  }

  async run(msg, { user, incident }) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
    this.client.sql.get(`SELECT * FROM guildMembers WHERE guildID = '${msg.guild.id}' AND userID = '${user.id}'`).then(async (row) => {
      if (!row) {
        row = { warns: 0 };
      }
      const { warns } = row;
      if (!incident) {
        return msg.say(`This user has ${warns} warnings.\n\nTo check an incident, type c?warns @${user.tag} [incident number here]`);
      }
      const reasons = await this.covertStringToArray(row.warnReason);
      if (!reasons[incident - 1]) {
        return msg.say(`Incident does not exist, please choice between 1 - ${reasons.length}`);
      }
      const iEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle(`${user.username} | Incident #${incident}`)
        .setDescription(`Incident #${incident} reason: \n**${reasons[incident - 1]}**`);
      return msg.say(iEmbed);
    });
  }
};
