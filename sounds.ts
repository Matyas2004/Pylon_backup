import { TEXT_CHANNELS, ROLES } from './listOfIds';

// Dictionary of the songs' names and the link to them on a random website that Maty found
var soundAdresses = {
  AAAAAA: 'https://audio.jukehost.co.uk/fGI8bVCOBXpFuNTxjUqksgOki7p4Gd23',
  'Ale mohl bys':
    'https://audio.jukehost.co.uk/U4MWHaF1afR7vzqMUlkxIkjre1FjOxf1',
  'Ale úplně': 'https://audio.jukehost.co.uk/T27iMxhMIh61U69ONaHbw5ay8zwCfrJU',
  Děleeej: 'https://audio.jukehost.co.uk/7dHPEJCzzhp8opLSuimlEiTUGfG9bZP1',
  'Hoď disk': 'https://audio.jukehost.co.uk/qzLpA1zNWWElqIwKopsvDAJZPdzuRkcM',
  'Dobré ráno, buráci':
    'https://audio.jukehost.co.uk/g2diYxVV9sFPI6qvKbs6o69RAqvWTYDO',
  Kuk: 'https://audio.jukehost.co.uk/Qo6InRJUFcot24uxHH59cKnDJPS97SsV',
  'Money money money':
    'https://audio.jukehost.co.uk/aZKFlVevzliFgvLMFwdgwD6N3SWF91cQ',
  "Money money money money money, it's a rich man's world":
    'https://audio.jukehost.co.uk/WCSMFxt5fZ3VneXxsmcfmNhSRlpc9bqE',
  'Na mobil': 'https://audio.jukehost.co.uk/J5tMjVFTzqIhxx7uetQeGaDiz6bO1HCN',
  'Pan prosimvás':
    'https://audio.jukehost.co.uk/PpCWe0cZwKLh0NrmGaB40qu1Z7Gaghic',
  Posh: 'https://audio.jukehost.co.uk/bJZ57CxYtOdntl9fXVC1HHQXmMSyMcZX',
  Pranky: 'https://audio.jukehost.co.uk/1PQTC523nDoFMR2DC7Ai6WVKzjMvqkuU',
  'Sovětská hymna':
    'https://audio.jukehost.co.uk/5BrIrqwzLwLVHx8999fftv8thJTRVrwX',
  'Tak a máme chyceného blbečka':
    'https://audio.jukehost.co.uk/GW17x0l3Cx6lxGs7IC0oOnCKDgCKccfH',
  'Ty buráku': 'https://audio.jukehost.co.uk/Rzw0A11JYlswHPvQssmhm75sUOx6ERnh',
};

discord.interactions.commands.register(
  {
    name: 'hrajte',
    description: 'Přehraje zvuk z výběru',
    options: (opt) => ({
      sound: opt.string({
        description: 'Co za zvuk',
        choices: [
          'AAAAAA',
          'Ale mohl bys',
          'Ale úplně',
          'Hoď disk',
          'Money money money',
          "Money money money money money, it's a rich man's world",
          'Na mobil',
          'Pan prosimvás',
          'Posh',
          'Pranky',
        ],
        name: 'jaky_zvuk',
      }),
    }),
  },
  async (interaction, { sound }) => {
    if (!soundAdresses[sound]) {
      interaction.respond('Něco se rozbilo, to vypadá...');
      return;
    }
    await interaction.respond({
      attachments: [
        {
          data: await fetch(soundAdresses[sound]).then((x) => x.arrayBuffer()),
          name: 'pylonsound.mp3',
        },
      ],
    });
  }
);

discord.interactions.commands.register(
  {
    name: 'hrajte_vedoucí',
    description: 'Přehraje LEPŠÍ zvuk z výběru',
    options: (opt) => ({
      sound: opt.string({
        description: 'Co za zvuk',
        choices: [
          'Děleeej',
          'Dobré ráno, buráci',
          'Kuk',
          'Sovětská hymna',
          'Tak a máme chyceného blbečka',
          'Ty buráku',
        ],
        name: 'jaky_zvuk',
      }),
    }),
  },
  async (interaction, { sound }) => {
    if (
      ![
        TEXT_CHANNELS['vedení'],
        TEXT_CHANNELS['vedení-oddílu'],
        TEXT_CHANNELS['memes-vedoucí'],
      ].includes(interaction.channelId) ||
      !(
        interaction.member.roles.includes(ROLES['Vedení']) ||
        interaction.member.roles.includes(ROLES['Roveři'])
      )
    ) {
      interaction.respond('Trocha slušnosti, ne?');
      return;
    }

    if (!soundAdresses[sound]) {
      interaction.respond('Něco se rozbilo, to vypadá...');
      return;
    }
    await interaction.respond({
      attachments: [
        {
          data: await fetch(soundAdresses[sound]).then((x) => x.arrayBuffer()),
          name: 'pylonsound.mp3',
        },
      ],
    });
  }
);

export {};
