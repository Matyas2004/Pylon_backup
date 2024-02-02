import { TEXT_CHANNELS } from './listOfIds';

discord.on('GUILD_MEMBER_ADD', async (member) => {
  const channelSend = await discord.getGuildTextChannel(
    TEXT_CHANNELS['přihlášení']
  );
  if (!channelSend) {
    return;
  }
  await channelSend.sendMessage(
    'Ahoj, ' +
      member.toMention() +
      ', vítej na Tuláckém Discord serveru.\nNapiš, prosím, příkaz **/join** a do něj svoje jméno (přezdívku) a družinu, do které chodíš. Některý z adminů tě pak brzy přidá na celý server. \nPokud tak neučiníš, zbytek serveru ti zůstane zapovězen.\n' +
      'Příklad: /join Maty Roveři'
  );
});

export {};
