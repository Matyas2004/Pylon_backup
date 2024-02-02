discord.interactions.commands.register(
  {
    name: 'poll',
    description: 'Vytvoří hlasování (jak jednoduché)',
    options: (opt) => ({
      question: opt.string({
        description: 'Na co se to vlastně chceš zeptat',
        name: 'otázka',
      }),
      choice_a: opt.string({
        description: 'Jedna z možností, kterou lze odpovědět',
        required: false,
        name: 'moznost_1',
      }),
      choice_b: opt.string({
        description: 'Jedna z možností, kterou lze odpovědět',
        required: false,
        name: 'moznost_2',
      }),
      choice_c: opt.string({
        description: 'Jedna z možností, kterou lze odpovědět',
        required: false,
        name: 'moznost_3',
      }),
      choice_d: opt.string({
        description: 'Jedna z možností, kterou lze odpovědět',
        required: false,
        name: 'moznost_4',
      }),
      choice_e: opt.string({
        description: 'Jedna z možností, kterou lze odpovědět',
        required: false,
        name: 'moznost_5',
      }),
      choice_f: opt.string({
        description: 'Jedna z možností, kterou lze odpovědět',
        required: false,
        name: 'moznost_6',
      }),
      choice_g: opt.string({
        description: 'Jedna z možností, kterou lze odpovědět',
        required: false,
        name: 'moznost_7',
      }),
      choice_h: opt.string({
        description: 'Jedna z možností, kterou lze odpovědět',
        required: false,
        name: 'moznost_8',
      }),
      choice_i: opt.string({
        description: 'Jedna z možností, kterou lze odpovědět',
        required: false,
        name: 'moznost_9',
      }),
    }),
  },
  async (
    interaction,
    {
      question,
      choice_a,
      choice_b,
      choice_c,
      choice_d,
      choice_e,
      choice_f,
      choice_g,
      choice_h,
      choice_i,
    }
  ) => {
    var choices: string[] = [];
    const guild = await interaction.getGuild();
    const uselessChannel = await interaction.getChannel();
    const channelId = uselessChannel.id;
    const textChannel = await discord.getTextChannel(channelId);

    if (!textChannel) {
      return;
    }

    for (var choice of [
      choice_a,
      choice_b,
      choice_c,
      choice_d,
      choice_e,
      choice_f,
      choice_g,
      choice_h,
      choice_i,
    ]) {
      if (!choice || choice == undefined) {
        continue;
      }
      choices.push(choice);
    }

    if (choices.length == 0) {
      choices = ['Ano', 'Ne'];
    }

    if (!choices) {
      return;
    }

    var allEmotes = await guild.getEmojis();
    if (!allEmotes) {
      return;
    }

    var yesEmotes: discord.Emoji[] = [];
    var noEmotes: discord.Emoji[] = [];

    for (var emote of allEmotes) {
      if (
        // Emotes that evoke 'Yes'
        [
          'Adam_approves',
          'Bart_approves_the_better_one',
          'Marek_true',
          'Bart_approved',
          'Mura_approved',
        ].includes(emote.name)
      ) {
        allEmotes.splice(allEmotes.indexOf(emote), 1);
        yesEmotes.push(emote);
        continue;
      } else if (
        ['Marek_false', 'Edvardos_angry', 'Piskot_sad'].includes(emote.name) // Emotes that evoke 'No'
      ) {
        allEmotes.splice(allEmotes.indexOf(emote), 1);
        noEmotes.push(emote);
        continue;
      }
    }

    console.log(allEmotes.length);

    const richEmbed = new discord.Embed({
      title: question,
      color: 0x29197c,
      thumbnail: {
        url: 'https://img39.rajce.idnes.cz/d3902/17/17742/17742655_a71649310700c6042f012d76417b1641/images/20220212_094410.jpg', // Štěně (for some reason)
      },
    });

    var emotesUsed = [];

    for (var choice of choices) {
      var emotePossibilities = [allEmotes, yesEmotes, noEmotes];
      var emoteGroup = 0;

      // If choice includes 'ano', it has a yesEmotes and similarly with 'ne'
      if (choice.toLowerCase().includes('ano') && yesEmotes.length > 0) {
        emoteGroup = 1;
      } else if (choice.toLowerCase().includes('ne') && noEmotes.length > 0) {
        emoteGroup = 2;
      }

      // Chooses a random emote for the response and then deletes the emote from the array
      var emoteOfChoice =
        emotePossibilities[emoteGroup][
          Math.floor(Math.random() * emotePossibilities[emoteGroup].length)
        ];
      emotePossibilities[emoteGroup].splice(
        emotePossibilities[emoteGroup].indexOf(emoteOfChoice),
        1
      );

      // Adds all the choices to description
      if (!richEmbed.description) {
        richEmbed.setDescription(
          emoteOfChoice.toMention() + ' ' + choice + '\n'
        );
      } else {
        richEmbed.setDescription(
          richEmbed.description +
            emoteOfChoice.toMention() +
            ' ' +
            choice +
            '\n'
        );
      }
      emotesUsed.push(emoteOfChoice);
    }

    // Creates an fake response (so on Discord it does not look like it cannot load)
    let fakeResponse = await interaction.respond('Generating poll');
    fakeResponse.delete();
    interaction.deleteOriginal();

    // Send the Embed with the poll and adding all the reactions
    let response = await textChannel.sendMessage(richEmbed);
    for (var emote of emotesUsed) {
      await response.addReaction(emote.name + ':' + emote.id);
    }
  }
);

export {};
