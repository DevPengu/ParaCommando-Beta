const { MessageAttachment } = require('discord.js');
const snekfetch = require('snekfetch');
const Canvas = require('canvas');

const applyText = (canvas, text) => {
  const ctx = canvas.getContext('2d');

  // Declare a base size of the font
  let fontSize = 70;

  do {
    ctx.font = `${fontSize -= 10}px sans-serif`;
  } while (ctx.measureText(text).width > canvas.width - 300);
  return ctx.font;
};

module.exports = async (client, member) => {
  // return;
  // add user to the database
  // client.sql.run('INSERT INTO guildMembers (guildID, userID) VALUES (?,?)', [member.guild.id, member.user.id]);

  /*let opt = client.sql.get(`SELECT welcomeEnable FROM guildSettings WHERE guildID = '${member.guild.id}'`);
  let roleopt = client.sql.get(`SELECT autoRoleID FROM guildSettings WHERE guildID = '${member.guild.id}'`)
  if(roleopt.autoRoleID){
    member.roles.add(roleopt.autoRoleID);
  }
  if(!opt.welcomeEnable) return;
  const chan = client.sql.get(`SELECT welcomeChannel FROM guildSettings WHERE guildID = ${member.guild.id}`);
  const channel = member.guild.channels.get(chan.welcomeChannel);
  if(!chan.welcomeChannel) return; */
  
  const guildSettings = await client.sql.get(`SELECT * FROM guildSettings WHERE guildID = '${member.guild.id}'`);
  if (!guildSettings) return;
  if (guildSettings.autoRole === 1) {
    const role = await member.guild.roles.get(guildSettings.autoRoleID);
    member.roles.add(role);
  }
  if (!guildSettings.welcomeEnable) return;
  const channel = member.guild.channels.get(guildSettings.welcomeChannel);
  if (!guildSettings.welcomeChannel) return;

  // if (member.guild.id !== '509877095988723743') return;
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
  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Welcome to ${member.guild.name},`, canvas.width / 15.0, canvas.height / 3.5);
  //

  // Username
  ctx.font = applyText(canvas, `${member.user.username}!`);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${member.user.username}!`, canvas.width / 15.0, canvas.height / 1.8);
  //
  // Bot Count
  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Member Count: ${member.guild.members.filter(mem => !mem.user.bot).size}`, canvas.width / 20.0, canvas.height / 1.02);
  ctx.fillText(`Bot Count: ${member.guild.members.filter(mem => mem.user.bot).size}`, canvas.width / 2.3, canvas.height / 1.02);
  ctx.fillText(`Total: ${member.guild.members.size}`, canvas.width / 1.2, canvas.height / 1.02);
  //

  // Profile Picture
  ctx.beginPath();
  ctx.arc(634, 166, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  // ctx.strokeStyle = '##0b07ff';
  // ctx.strokeRect(634, 166, 100, 0, Math.PI * 2)

  // const { body: buffer } = await snekfetch.get(msg.member.user.avatarURL());
  const profilePic = member.user.displayAvatarURL({ format: 'png' });
  // profilePic = profilePic.slice(0, -5);
  const { body: buffer } = await snekfetch.get(profilePic);
  const avatar = await Canvas.loadImage(buffer);
  ctx.drawImage(avatar, 534, 66, 200, 200);
  //

  const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
  channel.send(attachment);
};
