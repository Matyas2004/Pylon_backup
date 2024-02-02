import { TEXT_CHANNELS } from './listOfIds';

discord.on('MESSAGE_CREATE', async (message) => {
  const guild = await message.getGuild();
  if (!guild) {
    return;
  }

  // List of emotes that are 'laughing' (or at least considered so) in the format: 'name:ID'
  var hahaEmotes = [
    'Zufi_xD:831521028546101278',
    'Piskot_xD:831520888070602793',
    'Tomik_happy:700023031191437413',
    'Lil_Risa:689480059203092531',
    'RC:1008301319267811420',
  ];

  // Makes the same list for all emotes
  var allEmotesText = [];
  const allEmotes = await guild.getEmojis();
  if (!allEmotes) {
    return;
  }
  for await (var emoji of allEmotes) {
    allEmotesText.push(emoji.name + ':' + emoji.id);
  }

  // If it is a meme channel add a random funny emote
  if (
    message.channelId == TEXT_CHANNELS['memes'] ||
    message.channelId == TEXT_CHANNELS['memes-vedoucí']
  ) {
    message.addReaction(hahaEmotes[Math.floor(Math.random() * 5)]);
  } else if (Math.floor(Math.random() * 51) == 5) {
    // If it is not, add a random emote with the chance of 1:50
    message.addReaction(
      allEmotesText[Math.floor(Math.random() * allEmotesText.length)]
    );
  }
});

export {};
