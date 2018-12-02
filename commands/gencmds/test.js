
//   const welcomeCanvas = Canvas.createCanvas(800, 333)
//   const ctx = welcomeCanvas.getContext('2d')

//   const bg = await welcomeCanvas.loadImage('app/assets/bg.jpg').then((image) => {
//     ctx.drawImage(image, 0, 0, welcomeCanvas.width, welcomeCanvas.length)

//     console.log('<img src="' + welcomeCanvas.toDataURL() + '" />')
//   });

const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');
// const oneLine = require('oneline');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

module.exports = class TestCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'test',
      group: 'gencmds',
      memberName: 'test',
      description: 'TEST COMMAND: DO NOT USE',
      examples: ['test'],
      ownerOnly: true,
      guildOnly: true,
      permissions: [],
      clientPermissions: [],
      args: [],

    });
  }

  applyText(canvas, text) {
    const ctx = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 70;

    do {
      ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);
    return ctx.font;
  }

  async run(msg) {
    if(msg.channel.type != 'dm'){
      this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in Server: ${msg.guild.name} (${msg.guild.id})`);
    } else this.client.log.log(`${this.name} was used by ${msg.author.tag} (${msg.author.id}) in a DM channel`)
    // msg.say('No test code is currently active, try again later.')
    const canvas = Canvas.createCanvas(800, 333);
    const ctx = canvas.getContext('2d');
    const image = [
      './assets/bg1.jpg',
      './assets/bg2.jpg',
      './assets/bg3.png',
    ];
    const randomImage = image[Math.floor(Math.random() * image.length)];
    const background = await Canvas.loadImage(randomImage);

    // Border
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    //
    // Welcome Text
    ctx.font = '28px arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Welcome to ${msg.guild.name},`, canvas.width / 15.0, canvas.height / 3.5);
    //

    // Username
    ctx.font = this.applyText(canvas, `${msg.author.username}!`);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${msg.author.username}!`, canvas.width / 15.0, canvas.height / 1.8);
    //
    // Bot Count
    ctx.font = '18px arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Member Count: ${msg.guild.members.filter(mem => !mem.user.bot).size}`, canvas.width / 20.0, canvas.height / 1.02);
    ctx.fillText(`Bot Count: ${msg.guild.members.filter(mem => mem.user.bot).size}`, canvas.width / 2.3, canvas.height / 1.02);
    ctx.fillText(`Total: ${msg.guild.members.size}`, canvas.width / 1.2, canvas.height / 1.02);
    //

    // Profile Picture
    ctx.beginPath();
    ctx.arc(634, 166, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    // ctx.strokeStyle = '##0b07ff';
    // ctx.strokeRect(634, 166, 100, 0, Math.PI * 2)

    // const { body: buffer } = await snekfetch.get(msg.member.user.avatarURL());
    let profilePic = msg.member.user.avatarURL();
    profilePic = profilePic.slice(0, -5);
    const { body: buffer } = await snekfetch.get(profilePic);
    const avatar = await Canvas.loadImage(buffer);
    ctx.drawImage(avatar, 534, 66, 200, 200);
    //

    const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    msg.channel.send('This is a test', attachment);
  }
};
