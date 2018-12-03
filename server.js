// const { MessageEmbed } = require('discord.js');
const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const express = require('express');
const path = require('path');
const sqlite = require('sqlite')

const app = express();
app.get('/', (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);

sqlite.open(path.join(__dirname, "settings.sqlite3")).then((db) => {
    client.setProvider(new SQLiteProvider(db));
});

/*
Steps for images:
1. cd into asset folder (cd ./assets/)
2. wget [glitch image url]
3. mv [image code] [image name (./blah.[file extension])]
*/

const client = new CommandoClient({
  commandPrefix: 'c?',
  owner: ['300097311038504961', '175699560293728256'],
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
    ['levelcmds', 'Level Commands'],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    help: false,
    ping: false,
    prefix: false,
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.sql = require('sqlite');
client.config = require('./config.js');
client.log = require('./util/Logger');
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

// client.dispatcher.addInhibitor((msg) => {
//   // if(msg.guild.id === '264445053596991498') return;
//   if(!client.isOwner(msg.author.id)) return msg.say(`${client.user.username} is currently under maintenance, sorry for the inconvenience.`);
// })
//

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
