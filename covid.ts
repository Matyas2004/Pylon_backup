import { TEXT_CHANNELS } from './listOfIds';

// Adds spaces to numbers (from 1000000 makes 1 000 000)
function spacesInNumbers(number: string) {
  for (var i = -1; i >= -number.length / 3; i -= 1) {
    number =
      number.slice(0, i * 3 + (i + 1)) + ' ' + number.slice(i * 3 + (i + 1));
  }
  return number;
}

discord.interactions.commands.register(
  {
    name: 'covid',
    description: 'Pošle pár stručných informací o pandemii Covidu-19',
    options: (opt) => ({
      advancedOrNot: opt.string({
        description: 'Zdali chcete extra informace',
        required: false,
        name: 'plus',
        choices: ['+'],
      }),
    }),
  },
  async (interaction, { advancedOrNot }) => {
    // Makes sure it is only in specified channel (no longer needed)
    if (interaction.channelId != TEXT_CHANNELS['off-topič']) {
      interaction.respond(
        'Tento command lze použít jen v kanálu <#' +
          TEXT_CHANNELS['off-topič'] +
          '>'
      );
      return;
    }

    interaction.deleteOriginal();

    // Url for mzcr API; API key: 9ffbba959568af8ca63dc308e2de6505
    const url =
      'https://onemocneni-aktualne.mzcr.cz/api/v3/zakladni-prehled?page=1&itemsPerPage=100&properties%5B%5D=potvrzene_pripady_celkem&properties%5B%5D=potvrzene_pripady_vcerejsi_den&properties%5B%5D=aktivni_pripady&properties%5B%5D=umrti&properties%5B%5D=ockovane_osoby_celkem&properties%5B%5D=provedene_testy_vcerejsi_den&properties%5B%5D=provedene_antigenni_testy_vcerejsi_den&properties%5B%5D=aktualne_hospitalizovani&properties%5B%5D=ockovane_osoby_vcerejsi_den&apiToken=9ffbba959568af8ca63dc308e2de6505';

    const req = new Request(url);
    const urmum = await fetch(req);

    const data = await urmum.json();
    const casesToday = data['hydra:member'].pop();

    var totalInfections = casesToday['potvrzene_pripady_vcerejsi_den'];

    var color = 0x000000; //BLACK
    if (totalInfections < 100) {
      color = 0x00ff00; //GREEN
    } else if (totalInfections < 1000) {
      color = 0xffff00; //YELLOW
    } else if (totalInfections < 5000) {
      color = 0xff8000; //ORANGE
    } else if (totalInfections < 10000) {
      color = 0xff0000; //RED
    }

    var description = 'Krátké info o počtu případů covidu';

    var names = [
      'Celkový počet nakažených',
      'Počet nakažených za včera (bez reinfekcí)',
      'Celkový počet zemřelých',
      'Celkem očkovaných osob',
    ];

    var advancedNames = [
      'Provedených PCR testů za včera',
      'Počet aktuálně nakažených',
      'Počet lidí v nemocnicích s Covidem',
    ];

    var values = [
      spacesInNumbers(casesToday['potvrzene_pripady_celkem'].toString()),
      spacesInNumbers(totalInfections.toString()),
      spacesInNumbers(casesToday['umrti'].toString()),
      spacesInNumbers(casesToday['ockovane_osoby_celkem'].toString()),
    ];

    var advancedValues = [
      spacesInNumbers(casesToday['provedene_testy_vcerejsi_den'].toString()),
      spacesInNumbers(casesToday['aktivni_pripady'].toString()),
      spacesInNumbers(casesToday['aktualne_hospitalizovani'].toString()),
    ];

    if (advancedOrNot == '+') {
      names = names.concat(advancedNames);
      values = values.concat(advancedValues);
      description = 'Trochu delší info o počtu případů covidu';
    }

    // Creates an Embed
    const richEmbed = new discord.Embed({
      title: 'Případy koronaviru v Česku',
      color: color,
      description: description,
      thumbnail: {
        url: 'https://www.vscht.cz/images/0!0/uzel/52952/0001~~c_YP83TRNbRUyMwpLS4pSkxOtVJwdnFW0FVwzMksLk5UcE3OTi0q0VHwDbZWcEnMU_DITE_PzCsGCjj6BgMA.jpg', // Image of the Covid virus
      },
      footer: {
        text: 'Čísla nově zemřelých a aktuálně nakažených se někdy aktualizují později, tudíž nemusí být vždy 100% přesné',
      },
    });

    // Adds the fields to the embed
    for (var i = 0; i < names.length; i++) {
      richEmbed.addField({
        name: names[i],
        value: values[i],
        inline: false,
      });
    }

    await interaction.respond({ embeds: [richEmbed] });
  }
);

export {};
