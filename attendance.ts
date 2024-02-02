// This is for the KV database
const tagsKv = new pylon.KVNamespace('Attendance');

// Calculates the average attendace and rounds it
function calculateAverage(numbers: number[]) {
  var sum = 0;
  for (let i of numbers) {
    sum += i;
  }
  return Math.round(sum / numbers.length);
}

// Tries to find the minimal required attendace to pass the threshold at the end of the year (Updated)
function findMinimalAmount(
  threshold: number,
  monthNum: number,
  thisTerm: number,
  finalMonth: number,
  lastTerm = -1
) {
  var numOfMonths = finalMonth + 4;
  var requiredAverage = threshold * numOfMonths;
  var minimalAmount = 0;
  if (lastTerm == -1) {
    minimalAmount = Math.ceil(
      (requiredAverage - thisTerm * monthNum) / (numOfMonths - monthNum)
    );
  } else {
    minimalAmount = Math.ceil(
      (requiredAverage - thisTerm * monthNum - 5 * lastTerm) /
        (numOfMonths - 5 - monthNum)
    );
  }

  return Math.max(0, minimalAmount);
}

// The most important function
async function respond(
  url: string,
  isFirstTerm: boolean,
  memberNum: number,
  today: Date,
  name: string
) {
  // Fetches an API request from Google docs API
  const urmum = await fetch(url, { method: 'GET' });
  const data = await urmum.json();
  const THRESHOLD = await tagsKv.get('threshold');
  const FINAL_MONTH = await tagsKv.get('endMonth');
  const COMMAND_MODE = await tagsKv.get('mode');

  if (
    !THRESHOLD ||
    !FINAL_MONTH ||
    !COMMAND_MODE ||
    typeof THRESHOLD != 'number' ||
    typeof FINAL_MONTH != 'number' ||
    typeof COMMAND_MODE != 'number'
  ) {
    return;
  }

  var months = [];

  if (isFirstTerm) {
    months = [8, 9, 10, 11, 0];
  } else {
    months = [1, 2, 3, 4, 5];
  }

  const monthNum = months.indexOf(today.getMonth());

  // Finds the data for the specified user
  const userData = data['values'][memberNum];
  var attendanceNumbers = [];
  for (var i = 0; i < userData.length; i++) {
    attendanceNumbers.push(parseInt(userData[i]));
  }

  var thisMonthAttendance = parseInt(userData[monthNum]);
  var thisTermAttendance = calculateAverage(
    attendanceNumbers.slice(0, monthNum + 1)
  );
  var lastTermAttendance = 0;
  var thisTermWithoutThisMonth = 0;

  // The attendance for this term except for the current month
  if (monthNum == 0) {
    thisTermWithoutThisMonth = thisTermAttendance;
  } else {
    thisTermWithoutThisMonth = calculateAverage(
      attendanceNumbers.slice(0, monthNum)
    );
  }

  if (isFirstTerm) {
    var requiredAttendance = findMinimalAmount(
      THRESHOLD,
      monthNum,
      thisTermWithoutThisMonth,
      FINAL_MONTH
    );
  } else {
    lastTermAttendance = parseInt(userData.pop());
    var requiredAttendance = findMinimalAmount(
      THRESHOLD,
      monthNum,
      thisTermWithoutThisMonth,
      FINAL_MONTH,
      lastTermAttendance
    );
  }

  var color = 0x2510e3;
  var finalMessage = '';

  // If his attendace is higher than he needs at minimum, make the color green and add the message
  if (thisMonthAttendance >= requiredAttendance) {
    color = 0x95bb72;
    finalMessage =
      'Pokud budeš ve zbytku roku chodit stejně jako zatím chodíš tento měsíc, na tábor se dostaneš\n' +
      'Stačila by ti dokonce (do konce roku, vč. tohoto měsíce) pouze docházka: ' +
      requiredAttendance.toString() +
      '%';
  } else {
    color = 0xde0a26;
    finalMessage =
      'Pokud budeš ve zbytku roku chodit stejně jako zatím chodíš tento měsíc, na tábor se bohužel NEdostaneš\n';

    // If attendance over 100% is allowed
    if (COMMAND_MODE == 2) {
      finalMessage +=
        'Potřeboval bys (do konce roku, vč. tohoto měsíce) docházku alespoň: ' +
        requiredAttendance.toString() +
        '%';
      if (requiredAttendance > 100) {
        finalMessage +=
          '\nTo znamená 100% a ' +
          Math.ceil((requiredAttendance - 100) / 20).toString() +
          ' akcí navíc';
      }

      // If it is not allowed
    } else if (COMMAND_MODE == 1 && requiredAttendance <= 100) {
      finalMessage +=
        'Potřeboval bys (do konce roku, vč. tohoto měsíce) docházku alespoň: ' +
        requiredAttendance.toString() +
        '%';
    }
  }

  // Create an Embed
  const richEmbed = new discord.Embed({
    title: 'Docházka člena ' + name,
    color: color,
    description: 'Jak to vypadá s docházkou',
    thumbnail: {
      url: 'https://skauti-zbraslav.skauting.cz/wp-content/uploads/2022/10/IMG_9272-1024x683.jpg', //Bárt's picture
    },
    footer: {
      text: 'Čísla z tohoto měsíce ani tohoto pololetí nemusí být přesná, neboť docházka ještě nemusí být vyplněna',
    },
  });

  richEmbed.addField({
    name: 'Docházka za tento měsíc',
    value: thisMonthAttendance.toString() + '%',
    inline: false,
  });

  if (!isFirstTerm) {
    richEmbed.addField({
      name: 'Docházka za první pololetí',
      value: lastTermAttendance.toString() + '%',
      inline: false,
    });
  }

  richEmbed.addField({
    name: 'Docházka zatím za toto pololetí',
    value: thisTermAttendance.toString() + '%',
    inline: false,
  });

  if (!isFirstTerm) {
    richEmbed.addField({
      name: 'Celková docházka zatím',
      value:
        Math.round(
          (5 * lastTermAttendance + (monthNum + 1) * thisTermAttendance) /
            (5 + monthNum + 1)
        ).toString() + '%',
      inline: false,
    });
  }

  // Unless the 'Not care about tábor' mode is on
  if (COMMAND_MODE != 3) {
    richEmbed.addField({
      name: 'Předpověď docházky do konce roku',
      value: finalMessage,
      inline: false,
    });
  } else {
    color = 0x2510e3;
  }

  return richEmbed;
}

// 2nd instance function
async function findAttendance(
  interaction: discord.interactions.commands.SlashCommandInteraction,
  user: discord.GuildMember
) {
  const today = new Date();
  var isFirstTerm = false;

  var COMMAND_MODE = await tagsKv.get('mode');

  //IDs of members - needs to be changed every year
  const membersList = [
    '815852510237032509', //Schopátko
    '830527037495836742', //Pája
    '1081903382924628058', //Čmelda
    '1154109578745741462', //Fred
    '1155946245966278676', //Vojta
    '843152336712106054', //Šimon
    '937382170899677304', //Miky
    '1022191452958249050', //Popík
    '', //Krysa
    '897564808839307345', //Ďob
    '759427965041508373', //Kuky
    '761574665763160064', //Adam B.
    '772901714029576222', //Sam
    '773809711564324914', //Ponocnej
    '1154049444870889496', //Oko
    '689792908957974530', //Matěj
    '712719210719215656', //Zdena
    '1151937961684914247', //Václav
    '1040918537524482118', //Jája
    '717430834298093658', //Vorvaň
    '1153010509965185054', //Jonáš
    '715503995652669462', //Klacek
    '', //Koudy
    '897920466684112927', //Táda
    '1046871116863524944', //Vlčák
    '685045930181001249', //Hádě
    '758661483621384211', //Gandalf
    '897469868050370620', //Brambora
    '1152251208430538802', //Výbuch
    '1158110941125283961', //William
    '1155431907933298789', //Lumík
    '1153055480239894558', //Beran
    '1027224731272884264', //Vosík
    '801725425977786418', //Evžen
    '763407223263068220', //Kostička
    '1152251192534110218', //Dan
    '1154794148113698917', //Adam H.
    '693041490271928360', //Proužek
    '900437195779870741', //David
    '1046776889190125658', //Jahoda
    '790995962880851999', //Tobiáš
    '1056536362163118131', //Fretka #3
    '1019201929823404042', //Karel
    '889588885112373269', //Kilda
    '689765836264964097', //Kryštof
    '1154125029181755422', //Bimbo
    '1155385230824321095', //Kozel
  ];

  if (!membersList.includes(user.user.id)) {
    interaction.respond(
      'Pro tohoto člověka buď nelze nalézt docházku, nebo se něco rozbilo, každopádně vám nic neukážu'
    );
    return;
  }

  if (today.getMonth() == 6 || today.getMonth() == 7 || COMMAND_MODE == 0) {
    interaction.respond('Docházka není momentálně dostupná');
    return;
  }

  if (today.getMonth() == 0 || today.getMonth() > 7) {
    isFirstTerm = true;
  }

  const memberNum = membersList.indexOf(user.user.id);

  var url = '';

  //URL needs to be changed every year
  url +=
    'https://sheets.googleapis.com/v4/spreadsheets/1ehWy2Vu1JhPdf9QZ9ajCDwu11r5aDuLVGfMN0LLLv_I/values/';
  if (isFirstTerm) {
    //Needs to be tweaked every year to accurately represent the list and the cells we need
    url += 'Pro%20rodi%C4%8De%20I.pol!C5:G51';
  } else {
    //Needs to be tweaked every year to accurately represent the list and the cells we need
    url += 'Pro%20rodi%C4%8De%20II.pol!C5:I51';
  }

  // API key
  url += '?key=AIzaSyDI8AKMTX6WCNphue31TTRNSmayUFJFvAs';

  var nick = user.nick;
  if (!nick) {
    nick = user.user.username;
  }

  var richEmbed = await respond(url, isFirstTerm, memberNum, today, nick);
  interaction.respond({ embeds: [richEmbed] });
}

// Command to check other's attendance
discord.interactions.commands.register(
  {
    name: 'docházka_vedoucí',
    description: 'Podívejte se na docházku členstva',
    options: (opt) => ({
      user: opt.guildMember({
        description: 'Jméno',
        name: 'user',
      }),
    }),
  },
  async (interaction, { user }) => {
    findAttendance(interaction, user);
  }
);

//Command to check your own attendance
discord.interactions.commands.register(
  {
    name: 'docházka',
    description: 'Podívejte se na svoji docházku',
  },
  async (interaction, {}) => {
    const user = interaction.member;
    findAttendance(interaction, user);
  }
);

discord.interactions.commands.register(
  {
    name: 'docházka_nastavení',
    description: 'Nastavení atributů docházky',
    options: (opt) => ({
      key: opt.string({
        description: 'Co chcete nastavit',
        name: 'key',
        choices: ['mode', 'threshold', 'final month', 'help'],
      }),
      value: opt.integer({
        description:
          'Hranice=celé číslo v %; M0=Mimo provoz M1=Potřebná účast <= 100% M2=Účast > 100% M3=Nejde o tábor',
        name: 'value',
      }),
    }),
  },
  async (interaction, { key, value }) => {
    if (key == 'mode') {
      if (value < 0 || value > 3) {
        interaction.respond('Hodnota módu docházky musí být 0, 1, 2 nebo 3');
        return;
      }
      await tagsKv.put('mode', value);
      interaction.respond('Mód byl nastaven na ' + value);
      return;
    } else if (key == 'threshold') {
      if (value < 0 || value > 100) {
        interaction.respond('Buďme rozumní, dejme docházku mezi 0 a 100%');
        return;
      }
      await tagsKv.put('threshold', value);
      interaction.respond('Hranice byla nastavena na ' + value + ' %');
      return;
    } else if (key == 'final month') {
      if (value < 1 || value > 6) {
        interaction.respond('Nechme poslední měsíc mezi lednem a červnem');
        return;
      }
      await tagsKv.put('endMonth', value);
      interaction.respond(
        'Posledním měsícem byl nastaven měsíc číslo ' + value
      );
      return;
    } else if (key == 'help') {
      interaction.respond(
        '**Textový průvodce nastavením:**\n\
**mode**: Mode 0 = Docházka nefunguje\n\
          Mode 1 = Potřebná docházka pro tábor nesmí přesáhnout 100%\n\
          Mode 2 = Potřebná docházka může přesáhnout 100%\n\
          Mode 3 = Tábor není zohledněn v docházce\n\
**threshold**: Ukazuje hodnotu v procentech, která je potřeba pro účast na táboře\n\
**final month**: Poslední měsíc, v kterém se počítá docházka (mezi lednem a červnem)\n\
**help**: Ukáže tento seznam'
      );
    }
  }
);

export {};
