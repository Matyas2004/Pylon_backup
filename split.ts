import { ROLES, VOICE_CHANNELS } from './listOfIds';

discord.interactions.commands.register(
  {
    name: 'split',
    description:
      'Všechny přesune do/ vrátí z jejich družinových kanálů (Pouze pro ODD rádce a vyšší role)',
    options: (opt) => ({
      awayOrBack: opt.string({
        description: 'Jdou lidé pryč, či zpět',
        name: 'away_or_back',
        choices: ['away', 'back'],
      }),
    }),
  },
  async (interaction, { awayOrBack }) => {
    if (awayOrBack == 'away') {
      const guild = await interaction.getGuild();
      if (!guild) {
        return;
      }

      // Moves all children to their respective voice channels
      for await (const voice of guild.iterVoiceStates()) {
        if (voice.member.roles.includes(ROLES['Medvědi'])) {
          voice.member.edit({ channelId: VOICE_CHANNELS['Hovor medvědi'] });
        } else if (voice.member.roles.includes(ROLES['Lišáci'])) {
          voice.member.edit({ channelId: VOICE_CHANNELS['Hovor lišáci'] });
        } else if (voice.member.roles.includes(ROLES['Káňata'])) {
          voice.member.edit({ channelId: VOICE_CHANNELS['Hovor káňata'] });
        } else if (voice.member.roles.includes(ROLES['Netopýři'])) {
          voice.member.edit({ channelId: VOICE_CHANNELS['Hovor netopýři'] });
        }
      }
      await interaction.respond(
        'Všichni byli přesunuti do svých družinových voice channelů (snad)'
      );
    } else {
      const guild = await interaction.getGuild();
      if (!guild) {
        return;
      }
      // Moves everyone to Schůzky
      for await (const voice of guild.iterVoiceStates()) {
        voice.member.edit({ channelId: VOICE_CHANNELS['Schůzky'] });
      }
      await interaction.respond('Všichni jsou zpět (snad)');
    }
  }
);

export {};
