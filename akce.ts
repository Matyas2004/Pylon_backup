// SHOULD BE OPTIMISED (SOMEDAY)

discord.interactions.commands.register(
  {
    name: 'akce',
    description: 'Pošle, co nás čeká a nemine',
    options: (opt) => ({
      numberOfActions: opt.integer({
        description: 'Kolik akcí chcete ukázat',
        required: false,
        name: 'počet',
      }),
    }),
  },
  async (interaction, { numberOfActions }) => {
    // Fetches the html of the site as a giant string
    let response = await fetch('https://skauti-zbraslav.skauting.cz/');

    if (!response.ok) {
      interaction.respond(
        'Něco vybouchlo a tento command nyní nefachá, zkuste to znovu, či zavolejte nějakého ÍTý specialistu'
      );
      return;
    }

    if (!numberOfActions) {
      numberOfActions = 3;
    }

    if (numberOfActions < 1) {
      numberOfActions = 3;
    }

    // Finds the right part of the html string
    var wholeWebText = await response.text();
    var newsText = wholeWebText.substr(
      wholeWebText.search('Aktuality'),
      wholeWebText.search('</article>') - wholeWebText.search('Aktuality')
    );
    var eventsText = newsText.substr(
      newsText.search('<ul'),
      newsText.search('</ul') - newsText.search('<ul')
    );

    var allEvents = eventsText.split('<li>');

    var allEventsDictionaries = [];

    // For every event it had found
    for await (var event of allEvents) {
      if (
        !event.includes('<a href=') ||
        !event.includes('<time datetime=') ||
        !event.includes('<div class="wp-block-latest-posts__post-excerpt">')
      ) {
        continue;
      }

      //Find each of these categories in the string
      var eventDictionary = {
        webAddress: '',
        title: '',
        date: new Date(),
        description: '',
      };

      var webAdressAndRest = event.substr(event.search('<a href=') + 9);
      var webAddress = webAdressAndRest.substr(0, webAdressAndRest.search('"'));
      eventDictionary.webAddress = webAddress;

      var title = webAdressAndRest.substr(
        webAdressAndRest.search('>') + 1,
        webAdressAndRest.search('<') - webAdressAndRest.search('>') - 1
      );
      eventDictionary.title = title;

      var dateAndRest = webAdressAndRest.substr(
        webAdressAndRest.search('datetime=') + 10
      );
      var date = new Date(dateAndRest.substr(0, dateAndRest.search('"')));
      eventDictionary.date = date;

      var description = dateAndRest.substr(
        dateAndRest.search('-excerpt">') + 10
      );
      description = description.slice(0, -12);
      description = description.replace(/&nbsp;/g, '   ');
      eventDictionary.description = description;

      allEventsDictionaries.push(eventDictionary);
    }

    allEventsDictionaries.sort(function (a, b) {
      return b.date.getTime() - a.date.getTime();
    });

    // Construct an Embed
    const richEmbed = new discord.Embed({
      title: 'Aktuality o akcích',
      color: 0x0000ff,
      description: 'Co nás čeká a nemine',
      thumbnail: {
        url: 'https://www.rajce.idnes.cz/u1038398/avatar/large.jpg',
      },
    });

    if (allEventsDictionaries.length < numberOfActions) {
      numberOfActions = allEventsDictionaries.length;
    }

    // Create the required amount of Embed fields and send
    for (var i = 0; i < numberOfActions; i++) {
      richEmbed.addField({
        name: allEventsDictionaries[i].title,
        value:
          allEventsDictionaries[i].description +
          'Více informací naleznete na: ' +
          allEventsDictionaries[i].webAddress,
        inline: false,
      });
    }

    interaction.respond({ embeds: [richEmbed] });
  }
);

export {};
