/* eslint-disable */
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
// const oneLine = require('oneline');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'COMMAND HERE',
      // aliases: [],
      group: 'GROUP HERE',
      memberName: 'COMMAND NAME HERE',
      description: 'SIMPLE DESCRIPTION',
      examples: ['EXAMPLES'],
      ownerOnly: false,
      guildOnly: false,
      permissions: [],
      clientPermissions: [],
      // throttling: {},
      args: [],
    });
  }

  run(msg) {
    // Code Here
  }
};
