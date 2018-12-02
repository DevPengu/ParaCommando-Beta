// /* eslint-disable */
// const { Command } = require('discord.js-commando');
// const { MessageEmbed } = require('discord.js');
// // const oneLine = require('oneline');

// module.exports = class PrefixCommand extends Command {
//   constructor(client) {
//     super(client, {
//       name: 'prefix',
//       aliases: ['pre', 'pf'],
//       group: 'util',
//       memberName: 'prefix',
//       description: 'Change the guilds prefix, if no arguments are provided, it will show the current prefix',
//       examples: ['prefix', 'prefix !'],//usage examples
//       ownerOnly: false,
//       guildOnly: true,
//       permissions: ['MANAGE_SERVER', 'VIEW_AUDIT_LOG'],//Permissions the user needs to access the command
//       clientPermissions: [],//permissions that the bot needs to use the command
//       // throttling: {},
//       args: [
//         {
//           key: 'desired prefix/default',
//           prompt: 'What would you like the new prefix for this guild to be?',
//           type: 'string',
//           default: '',
//         }
//       ],
//     });
//   }

//   async run(msg, { prefix }) {
//     this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
//     let currPre = await this.client.sql.get(`SELECT prefix FROM guildSettings WHERE guildID = '${msg.guild.id}'`)

//     if(!prefix){
//       msg.reply(`this guild's current preix is ${currPre.prefix}! \nTo use a command, simply do ${currPre.prefix}<command name here>`)
//     }
//   }
// };
