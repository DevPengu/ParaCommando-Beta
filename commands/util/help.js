const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      group: 'util',
      memberName: 'help',
      description: 'Replies with a list of all bot commands',
      examples: ['help'],
      ownerOnly: false,
      guildOnly: false,
      permissions: [],
      guarded: true,
      clientPermissions: [],
      args: [
        {
          key: 'type',
          prompt: 'Please choose from: \ngen \neco \nrole \nmod \ncstate (disable/enable commands + usage) \nutil (ping, help, etc) \n \nAlternatively, you could add a command name (c?help <command>), to get more specific information on a command.',
          type: 'string',
          default: '',
        },
      ],
    });
  }

  run(msg, { type }) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
    const cmdGroups = this.client.registry.groups.map(g => g.id);
    const test2 = this.client.registry.groups.map(g => g.commands);

    if (cmdGroups.includes(type)) {
      const test = cmdGroups.indexOf(type);
      const cmds = test2[test].map(c => c);

      const e = new MessageEmbed()
        .setColor('BLUE')
        .setTitle(`${this.client.user.username} General Commands`)
        .setDescription(`To use commands in a guild, do \`${this.client.commandPrefix} command\` \nTo use commands in this DM, do the same, without a prefix.`);

      cmds.forEach((elem) => {
        if (!this.client.isOwner(msg.author.id)) {
          if (elem.ownerOnly) return;
        }
        let end = '.';
        if (elem.guildOnly) end = ' (Guild Only).';
        e.addField(elem.name, `${elem.description}${end}`);
      });
      if (msg.channel.type !== 'dm') msg.reply('check your DMs!');
      return msg.direct(e);
    }
    let com;
    if (type !== '') {
      com = this.client.registry.findCommands(type, true);
    }
    if (!com) {
      return msg.reply(`Please choose from:\n${cmdGroups.join('\n')}\n\nAlternatively, you could add a command name (c?help <command>), to get more specific information on a command.`);
    }
    if (!com[0]) return msg.reply('There is no command with this name');

    const e = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(`__**${com[0].name}**__ Command Information`)
      .addField('Description', com[0].description)
      .setFooter('This command does not include NSFW elements.');
    if (com[0].guildOnly) e.setTitle(`__**${com[0].name}**__ Command Information (Guild Only)`);
    if (com[0].ownerOnly) e.setTitle(`__**${com[0].name}**__ Command Information (Owner Only)`);
    if (!com[0].aliases.length <= 0) e.addField('Aliases', com[0].aliases.map(a => a).join(', '));
    if (com[0].details) e.addField('Details', com[0].details);
    if (com[0].format != null) e.addField('Format', `${this.client.commandPrefix}${com[0].name} ${com[0].format}`);
    else e.addField('Format', `${this.client.commandPrefix}${com[0].name}`);
    e.addField('Examples', com[0].examples.map(ex => ex));
    if (com[0].throttling != null) e.addField('Cooldown', `You may use this command ${com[0].throttling.usages} time(s) in ${com[0].throttling.duration} second(s).`);
    if (com[0].nsfw) e.setFooter('This command includes NSFW elements!');

    if (msg.channel.type !== 'dm') msg.reply('check your DMs!');
    return msg.direct(e);
  }
};
