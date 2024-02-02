discord.interactions.commands.register(
  {
    name: 'help',
    description: 'Ukáže v jednom seznamu, jaké tu máme commandy',
  },
  async (interaction) => {
    const richEmbed = new discord.Embed({
      title: 'Pylon příkazy',
      color: 0xccff00,
      description: 'Jaké příkazy umí Pylon',
      thumbnail: {
        url: 'https://notabene.skauting.cz/wp-content/uploads/2019/10/0-300x300.jpg', //Rozum's image
      },
    });

    // List of command and what they do
    const commands = {
      '/ping': 'Odpoví pong! (such humor)',
      '/mute start':
        'Zakáže psaní do textových kanálů (Pouze pro rádce a vyšší role)',
      'mute end':
        'Povolí psaní do textových kanálů (Pouze pro rádce a vyšší role)',
      '/split away':
        'Přesune všechny do jejich družinových kanálů (Pouze pro oddílové rádce a vyšší role)',
      'split back':
        'Vrátí všechny do kanálu Schůzky (Pouze pro oddílové rádce a vyšší role',
      '/connect':
        'Připojí Pylona do vašeho hlasového kanálu (bohužel nic neumí a ani se neumí odpojit)',
      '/covid':
        'Pošle pár stručných informací o pandemii Covidu-19 (jen v kanálu #novinky)',
      '/výbava': 'Vypíše vám povinnou výbavu na akce',
      '/akce': 'Pošle, co nás čeká a nemine',
      '/pause':
        'Umožňuje vám na omezenou dobu zastavit někoho od plného používání serveru (Pouze pro rádce a vyšší role)',
      '/ukrajina':
        'Ukáže vám ty nejnovější informace ohledně války na Ukrajině díky serveru Novinky.cz (jen v kanálu #novinky)',
      '/hrajte':
        'Povolí vám poslat jeden z vtipných zvuků v podobě .mp3 zprávy (/hrajte_vedoucí verze pro vedoucí)',
      '/docházka':
        'Ukáže vám vaší dosavadní docházku (/docházka_vedoucí verze pro vedoucí)',
      '/help': 'Ukáže tento seznam',
      'A kromě toho:': 'Na hoď disk odpoví: Chyť míč',
    };

    for (var command in commands) {
      richEmbed.addField({
        name: command,
        value: commands[command],
        inline: false,
      });
    }

    richEmbed.setTimestamp(new Date().toISOString());

    await interaction.respond({ embeds: [richEmbed] });
  }
);

export {};
