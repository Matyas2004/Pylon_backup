import { ROLES } from './listOfIds';

discord.interactions.commands.register(
  {
    name: 'new_leader',
    description: 'Zvolí nového vůdce oddílu',
  },
  async (interaction) => {
    var eligiblePeople = [];
    const guild = await interaction.getGuild();

    if (interaction.member.user.username == 'Adam02') {
      interaction.respond('Adam nemá hlas ve volení nového vůdce');
      return;
    }

    // Randomly chooses a new leader, which is a rover but not a leader and definitely not Adam
    for await (var person of guild.iterMembers()) {
      if (
        person.roles.includes(ROLES['Roveři']) &&
        !person.roles.includes(ROLES['Vůdce oddílu']) &&
        person.user.username != 'Adam02'
      ) {
        eligiblePeople.push(person);
      }
    }

    var newLeader =
      eligiblePeople[Math.floor(Math.random() * eligiblePeople.length)];

    newLeader.addRole(ROLES['Vůdce oddílu']);

    interaction.respond(
      'Novým vůdcem oddílu se stává: ' + newLeader.toMention()
    );
  }
);

export {};
