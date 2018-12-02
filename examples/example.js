const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
// const oneLine = require('oneline');

module.exports = class /*Command name here*/Command extends Command {
  constructor(client) {
    super(client, {
      name: 'COMMAND HERE',//What you would like the user to type
      // aliases: [],
      group: 'GROUP HERE',//Group the command should be placed in
      memberName: 'COMMAND NAME HERE',//Usually same as name^
      description: 'SIMPLE DESCRIPTION',//Describe what the command should do
      examples: ['EXAMPLES'],//usage examples
      ownerOnly: false,
      guildOnly: false,
      permissions: [],//Permissions the user needs to access the command
      clientPermissions: [],//permissions that the bot needs to use the command
      // throttling: {},
      args: [],
    });
  }

  run(msg) {
    // Code Here
  }
};
