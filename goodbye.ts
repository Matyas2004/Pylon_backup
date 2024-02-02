import { TEXT_CHANNELS } from './listOfIds';

discord.on('GUILD_MEMBER_REMOVE', async (event) => {
  const channel = await discord.getTextChannel(TEXT_CHANNELS['generál']);
  const user = await discord.getUser(event.user.id);
  if (!user) {
    channel?.sendMessage('Někdo asi odešel, ale pan Sloup neví kdo...');
    return;
  }
  channel?.sendMessage(user.username + ' se nás rozhodl opustit');
});

export {};
