discord.interactions.commands.register(
  {
    name: 'ping',
    description: 'Odpoví pong (such humor)',
  },
  async (interaction) => {
    if (
      Math.floor(Math.random() * 11) == 10 ||
      interaction.member.user.id == '335815311280439297' // Marek
    ) {
      if (Math.floor(Math.random() * 6) == 5) {
        interaction.respond(
          'PONG!, ty jsi úplná legenda, gratuluji\nPokořil jsi život, teď už tě nic nezastaví 🏆🏆🏆'
        );
      } else {
        interaction.respond('PONG!');
      }
    } else {
      interaction.respond('pong!');
    }
  }
);

export {};
