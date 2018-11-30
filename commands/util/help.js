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
    const gencmds = this.client.registry.findGroups('gencmds', true);
    const ecocmds = this.client.registry.findGroups('ecocmds', true);
    const rolecmds = this.client.registry.findGroups('rolecmds', true);
    const modcmds = this.client.registry.findGroups('modcmds', true);
    const cstate = this.client.registry.findGroups('commands', true);
    const utils = this.client.registry.findGroups('util', true);

    if (!type) return msg.reply('Please choose from: \ngen \neco \nrole \nmod \ncstate (disable/enable commands + usage) \nutil (ping, help, etc) \n \nAlternatively, you could add a command name (c?help <command>), to get more specific information on a command.');

    if (type === 'gen') {
      const e = new MessageEmbed()
        .setColor('BLUE')
        .setTitle(`${this.client.user.username} General Commands`)
        .setDescription(`To use commands in a guild, do \`${this.client.commandPrefix} command\` \nTo use commands in this DM, do the same, without a prefix.`);

      gencmds[0].commands.forEach((elem) => {
        if (!this.client.isOwner(msg.author.id)) {
          if (elem.ownerOnly) return;
        }
        let end = '.';
        if (elem.guildOnly) end = ' (Guild Only).';
        e.addField(elem.name, `${elem.description}${end}`);
      });
      msg.direct(e);
      if (msg.channel.type !== 'dm') msg.reply('check your DMs!');
    }

    if (type === 'eco') {
      const e = new MessageEmbed()
        .setColor('BLUE')
        .setTitle(`${this.client.user.username} Economy Commands`)
        .setDescription(`To use commands in a guild, do \`${this.client.commandPrefix} command\` \nTo use commands in this DM, do the same, without a prefix.`);

      ecocmds[0].commands.forEach((elem) => {
        if (!this.client.isOwner(msg.author.id)) {
          if (elem.ownerOnly) return;
        }
        let end = '.';
        if (elem.guildOnly) end = ' (Guild Only).';
        e.addField(elem.name, `${elem.description}${end}`);
      });
      msg.direct(e);
      if (msg.channel.type !== 'dm') msg.reply('check your DMs!');
    }

    if (type === 'role') {
      const e = new MessageEmbed()
        .setColor('BLUE')
        .setTitle(`${this.client.user.username} Role Commands`)
        .setDescription(`To use commands in a guild, do \`${this.client.commandPrefix} command\` \nTo use commands in this DM, do the same, without a prefix.`);

      rolecmds[0].commands.forEach((elem) => {
        if (!this.client.isOwner(msg.author.id)) {
          if (elem.ownerOnly) return;
        }
        let end = '.';
        if (elem.guildOnly) end = ' (Guild Only).';
        e.addField(elem.name, `${elem.description}${end}`);
      });
      msg.direct(e);
      if (msg.channel.type !== 'dm') msg.reply('check your DMs!');
    }

    if (type === 'mod') {
      const e = new MessageEmbed()
        .setColor('BLUE')
        .setTitle(`${this.client.user.username} Moderation Commands`)
        .setDescription(`To use commands in a guild, do \`${this.client.commandPrefix} command\` \nTo use commands in this DM, do the same, without a prefix.`);

      modcmds[0].commands.forEach((elem) => {
        if (!this.client.isOwner(msg.author.id)) {
          if (elem.ownerOnly) return;
        }
        let end = '.';
        if (elem.guildOnly) end = ' (Guild Only).';
        e.addField(elem.name, `${elem.description}${end}`);
      });
      msg.direct(e);
      if (msg.channel.type !== 'dm') msg.reply('check your DMs!');
    }

    if (type === 'cstate') {
      const e = new MessageEmbed()
        .setColor('BLUE')
        .setTitle(`${this.client.user.username} Command State`)
        .setDescription(`To use commands in a guild, do \`${this.client.commandPrefix} command\` \nTo use commands in this DM, do the same, without a prefix. \n \nThese commands are used to disable (or enable) unwanted commands.`);

      cstate[0].commands.forEach((elem) => {
        if (!this.client.isOwner(msg.author.id)) {
          if (elem.ownerOnly) return;
        }
        e.addField(elem.name, `${elem.description}`);
      });
      msg.direct(e);
      if (msg.channel.type !== 'dm') msg.reply('check your DMs!');
    }

    if (type === 'util') {
      const e = new MessageEmbed()
        .setColor('BLUE')
        .setTitle(`${this.client.user.username} Utility Commands`)
        .setDescription(`To use commands in a guild, do \`${this.client.commandPrefix} command\` \nTo use commands in this DM, do the same, without a prefix. \n \nThese commands are used to disable (or enable) unwanted commands.`);

      utils[0].commands.forEach((elem) => {
        if (!this.client.isOwner(msg.author.id)) {
          if (elem.ownerOnly) return;
        }
        e.addField(elem.name, `${elem.description}`);
      });
      msg.direct(e);
      if (msg.channel.type !== 'dm') msg.reply('check your DMs!');
    }

    const opts = ['gen', 'eco', 'role', 'mod', 'cstate', 'util'];
    if (!opts.includes(type)) {
      const com = this.client.registry.findCommands(type, true);
      if (com.length <= 0) return msg.say('Please choose from: \ngen \neco \nrole \nmod \ncstate (disable/enable commands + usage) \nutil (ping, help, etc) \n \nAlternatively, you could add a command name (c?help <command>), to get more specific information on a command.');
      console.log(com);
      const e = new MessageEmbed();
      e.setColor('BLUE');
      e.setTitle(`__**${com[0].name}**__ Command Information`);
      if (com[0].guildOnly) e.setTitle(`__**${com[0].name}**__ Command Information (Guild Only)`);
      if (com[0].ownerOnly) e.setTitle(`__**${com[0].name}**__ Command Information (Owner Only)`);
      if (!com[0].aliases.length <= 0) e.addField('Aliases', com[0].aliases.map(a => a).join(', '));
      e.addField('Description', com[0].description);
      if (com[0].format != null) e.addField('Format', `${this.client.commandPrefix}${com[0].name} ${com[0].format}`);
      else e.addField('Format', `${this.client.commandPrefix}${com[0].name}`);
      e.addField('Examples', com[0].examples.map((e) => e));
      if (com[0].throttling != null) e.addField('Cooldown', `You may use this command ${com[0].throttling.usages} time(s) in ${com[0].throttling.duration} second(s).`);
      if (com[0].nsfw) e.setFooter('This command includes NSFW elements!');
      else e.setFooter('This command does not include NSFW elements.');

      msg.direct(e);
      if (msg.channel.type !== 'dm') msg.reply('check your DMs!');
    }
  }
};
