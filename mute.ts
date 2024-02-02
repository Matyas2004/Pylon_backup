import { ROLES } from './listOfIds';

discord.interactions.commands.register(
  {
    name: 'mute',
    description:
      'Zakáže/Povolí psaní do textových kanálů (Pouze pro rádce a vyšší role)',
    options: (opt) => ({
      startOrEnd: opt.string({
        description: 'Začít či skončit mute (?)',
        name: 'mute_nebo_unmute',
        choices: ['start', 'end'],
      }),
      mute: opt.guildMember({
        description: 'Komu povolit/ zakázat psaní',
      }),
    }),
  },
  async (interaction, { startOrEnd, mute }) => {
    // Finds the correct case of being muted and the request to mute and acts accordingly
    if (startOrEnd == 'start') {
      if (mute.roles.includes(ROLES['Ztlumen'])) {
        await interaction.respond(
          '<@!' + mute.user.id + '> byl již dříve ztlumen'
        );
      } else {
        await mute.addRole(ROLES['Ztlumen']);
        await interaction.respond('<@!' + mute.user.id + '> byl ztlumen');
      }
    } else {
      if (!mute.roles.includes(ROLES['Ztlumen'])) {
        await interaction.respond('<@!' + mute.user.id + '> není ztlumen');
      } else {
        await mute.removeRole(ROLES['Ztlumen']);
        await interaction.respond('<@!' + mute.user.id + '> byl odtlumen');
      }
    }
  }
);

export {};
