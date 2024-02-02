import { ROLES } from './listOfIds';

let notGroovy = discord.on('MESSAGE_CREATE', async (message) => {
  const guild = await message.getGuild();
  const author = await guild?.getMember(message.author.id);

  if (
    (message.content.toLowerCase().includes('-play') ||
      message.content.toLowerCase().includes('/play')) &&
    !author?.roles.includes(ROLES['Vedení']) &&
    !author?.roles.includes(ROLES['Oddíloví rádci'])
  ) {
    await message.reply(
      'Je mi to líto, ale ' + author?.toMention() + ' nemůže ovládat Groovyho'
    );
  }
});

export { notGroovy };
