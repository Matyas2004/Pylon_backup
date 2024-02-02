discord.interactions.commands.register(
  {
    name: 'výbava',
    description: 'Vypíše vám povinnou výbavu na akce',
    options: (opt) => ({
      size: opt.string({
        description: 'Na jakou akci má povinná výbava býti',
        required: false,
        name: 'velikost',
        choices: ['schůzka', 'jednodenní', 'vícedenní', 'vše'],
      }),
    }),
  },
  async (interaction, { size }) => {
    if (!size) {
      size = 'vše';
    }

    // Create an Embed
    const richEmbed = new discord.Embed({
      title: 'Povinná výbava',
      color: 0xffff00,
      description: 'Co by vám na akcích nemělo chybět',
      thumbnail: {
        url: 'https://i1.sndcdn.com/avatars-000179649784-gox532-t500x500.jpg', //Můra's photo from ~2nd grade
      },
    });

    const smallField = {
      name: 'Malá (na schůzku)',
      value: `- propiska
- Stezka / Nováček
- skautský šátek
- obyčejná tužka + guma
- uzlovačka – alespoň 2 m dlouhá
- cancák – zápisník
- nůž
- KPZ`,
      inline: false,
    };

    const mediumField = {
      name: 'Střední (na jednodenní výpravu)',
      value: `- PVM
- batoh
- svačina
- láhev s pitím (alespoň 1,5 l)
- náhradní ponožky
- kapesník
- peníze (množství stanoveno před výpravou)
- dvě přestupní jízdenky na pražskou MHD (příp. tramvajenku / OpenCard)
- pláštěnka`,
      inline: false,
    };

    const bigField = {
      name: 'Velká (na vícedenní výpravu)',
      value: `- PVS
- karimatka
- spacák
- funkční baterka
- ešus
- lžíce
- oblečení na spaní a celý víkend
- osobní lékárnička`,
      inline: false,
    };

    // Add the fields that are required
    if (size == 'schůzka') {
      richEmbed.setFields([]);
      richEmbed.addField(smallField);
      interaction.respond({ embeds: [richEmbed] });
      return;
    }

    if (size == 'jednodenní') {
      richEmbed.setFields([]);
      richEmbed.addField(mediumField);
      interaction.respond({ embeds: [richEmbed] });
      return;
    }

    if (size == 'vícedenní') {
      richEmbed.setFields([]);
      richEmbed.addField(bigField);
      interaction.respond({ embeds: [richEmbed] });
      return;
    }

    if (size == 'vše') {
      richEmbed.setFields([]);
      richEmbed.addField(smallField);
      richEmbed.addField(mediumField);
      richEmbed.addField(bigField);
      interaction.respond({ embeds: [richEmbed] });
      return;
    }
  }
);

export {};
