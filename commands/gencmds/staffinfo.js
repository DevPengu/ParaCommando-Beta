const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class StaffInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'staffinfo',
      aliases: ['staff', 'staff-info'],
      group: 'gencmds',
      memberName: 'staffinfo',
      description: 'Information on the current staff members',
      examples: ['staffinfo', 'staff-info'],
      ownerOnly: true,
      guildOnly: false,
      permissions: [],
      clientPermissions: [],
      args: [],
    });
  }

  run(msg) {
    //
    let owners = msg.guild.roles.get('509878112390086661').members;
    if (owners.size === 0) owners = 'No members currently hold this position!';
    else owners = owners.map(m => m.user.tag);
    //
    let devs = msg.guild.roles.get('512702720352976896').members;
    if (devs.size === 0) devs = 'No members currently hold this position!';
    else devs = devs.map(m => m.user.tag);
    //
    let admins = msg.guild.roles.get('510207358925013003').members;
    if (admins.size === 0) admins = 'No members currently hold this position!';
    else admins = admins.map(m => m.user.tag);
    //
    let mods = msg.guild.roles.get('509885307794227221').members;
    if (mods.size === 0) mods = 'No members currently hold this position!';
    else mods = mods.map(m => m.user.tag);
    //
    let helpers = msg.guild.roles.get('510208363481792527').members;
    if (helpers.size === 0) helpers = 'No members currently hold this position!';
    else helpers = helpers.map(m => m.user.tag);
    //
    let man = msg.guild.roles.get('510210941107830784').members;
    if (man.size === 0) man = 'No members currently hold this position!';
    else man = man.map(m => m.user.tag);

    const e = new MessageEmbed()
      .setColor('BLUE')
      .setAuthor(`${msg.guild.name} Staff Information`)
      .addField('Owners', owners, true)
      .addField('Developers', devs, true)
      .addField('Admins', admins)
      .addField('Moderators', mods, true)
      .addField('Helpers', helpers, true)
      .addField('Community Manager', man);
    msg.say(e);
  }
};

// let admins = msg.guild.roles.get('id').members
// if(admins.size == 0) admins = "No admins";
// else admins = admins.map(m => m.user)
