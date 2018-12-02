exports.parseUser = (message, user) => {
  const member = message.guild.member(user) || null;
  let parse;
  if (user.id === message.author.id) {
    parse = true;
    message.channel.send("You can't do that to yourself, why did you try?");
    return parse;
  } if (member) {
    parse = true;
    if (member.roles.highest.position >= message.member.roles.highest.position) {
      message.channel.send('The targeted member has a higher or equal role position than you.');
      return parse;
    }
  }
  return user;
};
