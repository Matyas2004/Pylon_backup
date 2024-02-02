//API key = e5809083986941399ec134fb78a6e571

import { TEXT_CHANNELS } from './listOfIds';

discord.interactions.commands.register(
  {
    name: 'ukrajina',
    description:
      'Ukáže vám ty nejnovější informace ohledně války na Ukrajině díky serveru Novinky.cz',
    options: (opt) => ({
      numberOfNews: opt.integer({
        description: 'Kolik novinek se chcete dozvědět',
        required: false,
        name: 'počet',
        choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      }),
    }),
  },
  async (interaction, { numberOfNews }) => {
    if (interaction.channelId != TEXT_CHANNELS['off-topič']) {
      interaction.respond(
        'Tento command lze použít jen v kanálu <#' +
          TEXT_CHANNELS['off-topič'] +
          '>'
      );
      return;
    }

    if (!numberOfNews) {
      numberOfNews = 3;
    }

    interaction.deleteOriginal();
    var date = new Date();
    date.setDate(date.getDate() - 1);
    date.setMilliseconds(0);
    const url =
      'https://newsapi.org/v2/everything?domains=novinky.cz&q=ukrajin&sortBy=publishedAt&pageSize=' +
      numberOfNews +
      '&page=1&apiKey=e5809083986941399ec134fb78a6e571';

    // Fetches an api request
    const req = new Request(url);
    const urmum = await fetch(req);
    const data = await urmum.json();

    // Creates an Embed
    const richEmbed = new discord.Embed({
      title: 'Nové zprávy z ukrajiny',
      color: 0x0057b7,
      description:
        'Co se v posledním dni stalo na ukrajině, brought to you by novinky.cz',
      thumbnail: {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/2560px-Flag_of_Ukraine.svg.png', // Ukrainian flag
      },
      footer: {
        text: 'Sbírky na pomoc Ukrajině:\nČČK:333999/2700, Člověk v tísni:0093209320/0300, Sbírka ukrajinské ambasády:304452700/0300',
      },
    });

    // Adds all the field with the information to the Embed
    for (var i = 0; i < numberOfNews; i++) {
      richEmbed.addField({
        name: data['articles'][i]['title'],
        value:
          data['articles'][i]['description'] +
          '\nVíce informací na: ' +
          data['articles'][i]['url'],
        inline: false,
      });
    }

    interaction.respond({ embeds: [richEmbed] });
  }
);

export {};
