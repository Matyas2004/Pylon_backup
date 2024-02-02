import { GUILD_ID, TEXT_CHANNELS } from './listOfIds';

// On Sunday at 15:00 GMT (Greenwich Mean Time)
pylon.tasks.cron('usernameReminder', '0 00 15 * * 1 ', async () => {
  const guild = await discord.getGuild(GUILD_ID);
  const textChannel = await discord.getGuildTextChannel(
    TEXT_CHANNELS['přihlášení']
  );
  if (!guild) {
    return;
  }
  var zeroRoleMembers = [];
  for await (const member of guild.iterMembers()) {
    if (member.roles.length > 0 || member.user.id == '1081004946872352958') {
      continue;
    } else {
      // If someone is on the server for longer than 3 months and doesn't have a role, kick him
      zeroRoleMembers.push(member.toMention() + ' ');
      const kickDate = new Date();
      const todayMonth = kickDate.getMonth();
      kickDate.setMonth(todayMonth - 3);
      const joinedAt = new Date(member.joinedAt);
      if (joinedAt < kickDate) {
        member.kick();
      }
    }
  }

  // If there are any members without roles, send them a remined to use the command /join
  if (zeroRoleMembers.length > 0) {
    textChannel?.sendMessage(
      zeroRoleMembers.toString() +
        `, zatím jste do chatu nenapsali příkaz ***/join***, tudíž vás nemůžeme přidat na celý Discord. Napište, prosím, do chatu command ***/join*** a do něj svoji přezdívku a družinu, do které chodíte.
Pokud budete více než 3 měsíce na serveru, aniž byste napsali tento command, pak budete kicknuti (aby tu nebyly účty, od kterých již majitelé nemají přístupové údaje)
Příklad: /join Maty Roveři`
    );
  }
});

export {};
