import { TEXT_CHANNELS, ROLES, GUILD_ID } from './listOfIds';

discord.interactions.commands.register(
  {
    name: 'join',
    description: 'Vyplň tento command, aby ses mohl připojit na server',
    options: (opt) => ({
      nicknameLowerCase: opt.string({
        description: 'Tvé jméno, či přezdívka',
        name: 'prezdivka',
      }),
      group: opt.string({
        description: 'Do jaké družiny chodíš',
        name: 'druzina',
        choices: [
          'Medvědi',
          'Lišáci',
          'Káňata',
          'Netopýři',
          'Roveři',
          'Oldskauti',
          'Skautky',
          'Ani jedna z těchto',
        ],
      }),
    }),
  },
  async (interaction, { nicknameLowerCase, group }) => {
    var nickname =
      nicknameLowerCase.charAt(0).toUpperCase() + nicknameLowerCase.slice(1);
    // Send a message to #vedení-oddílu
    const channelToSend = await discord.getGuildTextChannel(
      TEXT_CHANNELS['vedení-oddílu']
    );

    // If he is not in any of the groups, send this message
    if (group == 'Ani jedna z těchto') {
      let response = await channelToSend?.sendMessage(
        '<@&' +
          ROLES['Admin'] +
          '>, ' +
          interaction.member.toMention() +
          ' se chce připojit na náš server, tvrdí, že se jmenuje ' +
          nickname +
          ', ale nedokáže se ztotožnit s žádnou naší rolí, je potřeba mu je přidat manuálně'
      );
      interaction.respond(
        'Díky, někdo z Adminů tě již brzy přidá na celý server'
      );
      return;
    }

    // If he is, send a message, which can be reacted on via the next method
    let response = await channelToSend?.sendMessage(
      '<@&' +
        ROLES['Admin'] +
        '>, ' +
        interaction.member.toMention() +
        ' se chce připojit na náš server, tvrdí, že se jmenuje ' +
        nickname +
        ' a že patří do družiny: ' +
        group +
        '\nPokud to je v pořádku, zareagujte emotem ✅ na tuto zprávu'
    );
    response?.addReaction('✅');
    interaction.respond(
      'Díky, někdo z Adminů tě již brzy přidá na celý server'
    );
  }
);

discord.on('MESSAGE_REACTION_ADD', async (addReaction) => {
  // If the added emote definitely is not an approval on a message of joining request, end the method
  if (
    addReaction.emoji.name != '✅' ||
    addReaction.channelId != TEXT_CHANNELS['vedení-oddílu'] ||
    !addReaction.member?.roles.includes(ROLES['Admin'])
  ) {
    return;
  }

  const textChannelSent = await discord.getGuildTextChannel(
    TEXT_CHANNELS['vedení-oddílu']
  );
  const message = await textChannelSent?.getMessage(addReaction.messageId);
  const guild = await discord.getGuild(GUILD_ID);

  // Finds if the message is definitely a joining request (Pylon is the author and it ends with the string)
  if (
    message?.author.id != '270148059269300224' ||
    !message.content.endsWith(
      'Pokud to je v pořádku, zareagujte emotem ✅ na tuto zprávu'
    )
  ) {
    return;
  }

  // Splits the original message into required pieces
  var messageText = message.content.replace('<@&' + ROLES['Admin'] + '>, ', '');
  messageText = messageText.replace(
    'se chce připojit na náš server, tvrdí, že se jmenuje ',
    ''
  );
  messageText = messageText.replace('a že patří do družiny: ', '');
  messageText = messageText.replace(
    '\nPokud to je v pořádku, zareagujte emotem ✅ na tuto zprávu',
    ''
  );

  var infoList = messageText.split(' ');

  // Finds the member
  var memberMentioned = infoList.shift();
  var memberId = memberMentioned?.replace('<@', '');
  memberId = memberId?.replace('!', '');
  memberId = memberId?.replace('>', '');
  if (!memberId) {
    return;
  }
  var member = await guild?.getMember(memberId);

  // Finds his role
  var role = infoList.pop();
  if (!role || !member) {
    return;
  }
  if (member.roles.length > 0) {
    return;
  }

  // Finds his nickname
  var nickname = infoList.join(' ');

  await member?.edit({ nick: nickname });
  await member?.addRole(ROLES[role]);

  // If he should have the role 'Skauti' add it
  if (!['Roveři', 'Skautky', 'Oldskauti'].includes(role)) {
    await member?.addRole(ROLES['Skauti']);
  }

  textChannelSent?.sendMessage(
    member.toMention() +
      ' byl přidán na náš server, patří do družiny: ' +
      role +
      ' a jmenuje se: ' +
      nickname
  );
});

export {};
