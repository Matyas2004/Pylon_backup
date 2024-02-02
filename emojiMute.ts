import { GUILD_ID, ROLES, TEXT_CHANNELS } from './listOfIds';

let emojiMute = discord.on('MESSAGE_REACTION_ADD', async (emojiEvent) => {
  const guild = await discord.getGuild(GUILD_ID);

  // Finds the user that added the emote
  var member = await guild?.getMember(emojiEvent.userId);
  var user = await discord.getUser(emojiEvent.userId);
  if (!user) {
    return;
  }

  // Finds the Text channel and the message the emote was added in
  const textChannel = await discord.getGuildTextChannel(emojiEvent.channelId);
  const message = await textChannel?.getMessage(emojiEvent.messageId);
  if (!message) {
    return;
  }
  if (emojiEvent.emoji.name == undefined) {
    return;
  }

  // Determines if someone had already added the same emote
  var isMore = false;
  for (var reaction of message.reactions) {
    if (reaction.emoji.name == emojiEvent.emoji.name && reaction.count > 1) {
      isMore = true;
    }
  }

  // If the message was sent in #oznámení or #schůzky and the emote was first of its kind and not added by someone with the role 'Vedení', delete the emote
  if (
    !member?.roles.includes(ROLES['Vedení']) &&
    (textChannel?.id == TEXT_CHANNELS['oznámení'] ||
      textChannel?.id == TEXT_CHANNELS['schůzky']) &&
    !isMore
  ) {
    if (emojiEvent.emoji.type == 'GUILD') {
      await message?.deleteReaction(
        emojiEvent.emoji.name + ':' + emojiEvent.emoji.id,
        user
      );
    } else {
      await message?.deleteReaction(emojiEvent.emoji.name, user);
    }
  }
});

export { emojiMute };
