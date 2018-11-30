const { MessageEmbed } = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const express = require('express');
const path = require('path');

const app = express();
app.get('/', (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);

/*
Steps for images:
1. cd into asset folder (cd ./assets/)
2. wget [glitch image url]
3. mv [image code] [image name (./blah.[file extension])]
*/

const client = new CommandoClient({
  commandPrefix: 'c?',
  owner: ['429317161354526732', '300097311038504961', '175699560293728256'],
  disableEveryone: true,
  unknownCommandResponse: false,
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['gencmds', 'General Commands'],
    ['modcmds', 'Moderation Commands'],
    ['ecocmds', 'Economy Commands'],
    ['funcmds', 'Fun Commands'],
    ['rolecmds', 'Role Commands'],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    help: false,
    ping: false,
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.sql = require('sqlite');
client.config = require('./config.js');
client.log = require('./modules/Logger');
require('./modules/functions.js')(client);

client.sql.open('./database.sqlite');

/*
client.sql.open('./data/Bastion.sqlite').then((db) => {
  db.run('PRAGMA foreign_keys = ON');
  require('./utils/populateDatabase')(client.sql);
}); */

// Inhibitors//
const blacklistedUsers = [
  '396701814126411786',
];

const disabled = [
  '509877095988723743',
];

// Make this into a command to remove it from server
client.dispatcher.addInhibitor((msg) => {
  if (!client.isOwner(msg.author.id)) {
    if (msg.channel.type !== 'dm') {
      if (msg.guild.id !== '509877095988723743') {
        const e = new MessageEmbed()
          .setColor('RED')
          .setFooter('Commands are currently disabled in all guilds, sorry for the inconvenience.');

        return msg.say(e).then(m => m.delete({ timeout: 10000 }));
      }
    }
  }
});

// Make this into a command to remove it from server
// write me in discord if you need any chanches or commands :) -OptimusBrime/TheLPCheat

// client.dispatcher.addInhibitor(msg => {
//   if(blacklistedUsers.includes(msg.author.id)) {
//     let e = new MessageEmbed()
//     .setColor('RED')
//     .setFooter(`${msg.author.username}, you may not use this bots commands, you are blacklisted!`)

//     return msg.say(e).then(m => m.delete({ timeout: 10000 }));
//   }

// });

// Make this into a command to remove it from server
client.dispatcher.addInhibitor((msg) => {
  if (!client.isOwner(msg.author.id)) {
    if (msg.channel.id !== '511060767194218498') {
      if (msg.channel.type !== 'dm') {
        const e = new MessageEmbed()
          .setColor('RED')
          .setFooter('Please use commands in the appropriate channel!');

        return msg.say(e).then(m => m.delete({ timeout: 10000 }));
      }
    }
  }
});

const init = async () => {
  const evtFiles = await readdir('./events/');
  client.log.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach((file) => {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  // Login
  client.login(process.env.A);
};

init();
