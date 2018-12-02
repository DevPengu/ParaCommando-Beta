const { Command } = require('discord.js-commando');
// const { MessageEmbed } = require('discord.js');
// const oneLine = require('oneline');

module.exports = class SettingsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      // aliases: [],
      group: 'util',
      memberName: 'settings',
      description: 'Settings for welcome messages, auto assignment of roles, and more...',
      details: 'To enable/disable the welcome message: \nc?settings welcome enable/disable \nTo choose/change a channel the welcome messages channel: \nc?settings welcome channel <mention channel here> \nTo enable/disable auto assignment of roles: \nc?settings role enable/disable \nTo choose a role to be auto assigned (upon joining the guild): \nc?settings role <role here>',
      examples: ['EXAMPLES'],
      ownerOnly: false,
      guildOnly: false,
      permissions: [],
      clientPermissions: [],
      // throttling: {},
      args: [
        {
          key: 'setting',
          prompt: 'What setting would you like to change? (c?help settings for more information)',
          type: 'string',
        }
        ,
        {
          key: 'option',
          prompt: 'What would you like to do? (c?help settings for more information)',
          type: 'string',
          default: '',
        }
        ,
        {
          key: 'choice',
          prompt: 'Please mention a channel or role!',
          type: 'string',
          default: '',
        },
      ],
    });
  }

  run(msg, args) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
    if (args.setting === 'welcome') {
      if (args.option === 'enable') {
        this.client.sql.run(`UPDATE guildSettings SET welcomeEnable = true WHERE guildID = '${msg.guild.id}'`);
        msg.reply('Set `welcome` to `enabled`');
        return;
      } else if (args.option === 'disable') {
        this.client.sql.run(`UPDATE guildSettings SET welcomeEnable = false WHERE guildID = '${msg.guild.id}'`);
        msg.reply('Set `welcome` to `disabled`');
        return;
      } else if (args.option === 'channel') {
        const channel = msg.mentions.channels.first();
        if (!channel) return msg.reply('Command Cancelled, please include a channel next time!');
        this.client.sql.run(`UPDATE guildSettings SET welcomeChannel = '${channel.id}' WHERE guildID = '${msg.guild.id}'`);
        this.client.sql.run(`UPDATE guildSettings SET welcomeEnable = true WHERE guildID = '${msg.guild.id}'`)
        msg.reply(`Set \`welcome channel\` to \`${channel.name}\``);
        return;
      }
    }

    if (args.setting === 'role') {
      if (args.option === 'enable') {
        this.client.sql.run(`UPDATE guildSettings SET autoRole = true WHERE guildID = '${msg.guild.id}'`);
        msg.reply('Set `auto role` to `enabled`');
        return;
      }
      else if (args.option === 'disable') {
        this.client.sql.run(`UPDATE guildSettings SET autoRole = false WHERE guildID = '${msg.guild.id}'`);
        msg.reply('Set `auto role` to `disabled`');
        return;
      }
      else if(args.option === 'set'){
        let opt = msg.mentions.roles.first();
        if(!opt) return msg.reply('Command Cancelled, please include a valid role next time!')
        // console.log(opt);
        this.client.sql.run(`UPDATE guildSettings SET autoRoleID = '${opt.id}' WHERE guildID = '${msg.guild.id}'`);
        msg.reply(`Set \`auto role\` to \`${opt.name}\``);
        return;
      }
    }
    msg.say('Invalid Argument, please use c?help settings to find information on usage!')
  }
};
