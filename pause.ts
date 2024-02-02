discord.interactions.commands.register(
  {
    name: 'pause',
    description:
      'Umožní vám na omezenou dobu zastavit někoho od plného užívání serveru (Pouze pro rádce a vyšší role)',
    options: (opt) => ({
      member: opt.guildMember({
        description: 'Komu chcete dát pauzu',
        name: 'uživatel',
      }),
      timeuntil: opt.integer({
        description: 'Dokdy by měl mít člověk pauzu (bez jednotky)',
        name: 'čas',
        required: false,
      }),
      unit: opt.string({
        description: 'Dokdy by měl mít člověk pauzu (časová jednotka)',
        name: 'jednotka',
        required: false,
        choices: ['sekund', 'minut', 'hodin', 'dnů', 'týdnů', 'konec'],
      }),
    }),
  },
  async (interaction, { member, timeuntil, unit }) => {
    if (!timeuntil) {
      timeuntil = 5;
    }

    if (!unit) {
      unit = 'minut';
    }

    // Calculates the time when a user should be unpaused (by adding to the current time)
    var timeToMute = new Date();
    if (unit == 'sekund') {
      timeToMute.setSeconds(timeToMute.getSeconds() + timeuntil);
    } else if (unit == 'minut') {
      timeToMute.setMinutes(timeToMute.getMinutes() + timeuntil);
    } else if (unit == 'hodin') {
      timeToMute.setHours(timeToMute.getHours() + timeuntil);
    } else if (unit == 'dnů') {
      timeToMute.setDate(timeToMute.getDate() + timeuntil);
    } else if (unit == 'týdnů') {
      timeToMute.setDate(timeToMute.getDate() + timeuntil / 7);
    } else if (unit == 'konec') {
      member.edit({ communicationDisabledUntil: null });
      interaction.respond(member.user.toMention() + ' byl odpauznut');
      return;
    }

    // Mutes the user for the time
    member.edit({ communicationDisabledUntil: timeToMute.toISOString() });
    interaction.respond(
      member.user.toMention() +
        ' byl pauznut na: ' +
        timeuntil +
        unit +
        ', tedy do: ' +
        timeToMute.toLocaleDateString()
    );
  }
);

export {};
