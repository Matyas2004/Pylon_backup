// Added to Scout bot
import * as pingModule from './ping';
pingModule; //Command /PING

// WON'T BE added to Scout bot
import { notGroovy } from './groovy';
//notGroovy; // Oznámí členům, že nemají práva na Groovyho

// Added to Scout bot
import { hodDisk } from './disk';
hodDisk; //Odpovídá 'Chyť míč' na 'Hoď disk'

// Added to Scout bot
import * as hahaModule from './emoteReaction';
hahaModule; // Dává emoty na zprávy v meme kanálech + v ostatních s šancí 1:50

// WON'T BE added to Scout bot
import { adam } from './adam';
//adam; // Odpovídá, že Adam neexistuje, když ho někdo zmíní

// Added to Scout bot
import * as welcomeModule from './welcome';
welcomeModule; // Pošle zprávu, když se někdo přidá na server

// Added to Scout bot
import * as goodbyeModule from './goodbye';
goodbyeModule; // Pošle zprávu, když někdo opustí server

// WON'T BE added to Scout bot
import { emojiMute } from './emojiMute';
//emojiMute; //Automaticky maže emoty v některých text channelech

// WON'T BE added to Scout bot
import * as muteModule from './mute';
//muteModule; // Ztlumí a odtlumí uživatele (Dá mu muted roli)

// Added to Scout bot
import * as splitModule from './split';
splitModule; // Command /split (z covidu)

// Added to Scout bot
import * as covidModule from './covid';
covidModule; // Command na info o nakažených Covidem apod.

// Added to Scout bot
import * as helpModule from './help';
helpModule; // Command /help (info o commandech)

// WON'T BE added to Scout bot
import { testCommands } from './test';
//testCommands; // Command na podmínky schůzek (z covidu)

import * as pauseModule from './pause';
pauseModule; // Command na dávání pauzy uživatelům

// Added to Scout bot
import * as stuffModule from './vybava';
stuffModule; // Command na doporučenou výbavu na akce

// WON'T BE added to Scout bot
import * as eventModule from './akce';
eventModule; // Command s akcemi ze stránky

import * as ukraineModule from './ukrajina';
ukraineModule; // Command s informacemi o Ukrajině

// WON'T BE added to Scout bot
import * as leaderModule from './newLeader';
leaderModule; // Command na jmenování nového vůdce oddílu

import * as pollModule from './poll';
pollModule; // Command na hlasování (místo poll bota)

import * as reminderModule from './usernameReminder';
reminderModule; // Připomíná těm, co jsou v #příhlášení, že zatím nenapsali svoji přezdívku

// Added to Scout bot
import * as joinModule from './join';
joinModule; // Command /join (na připojování nových členů)

import * as soundModule from './sounds';
soundModule; // Posílá zvuky z Adamova soundboardu (commandy /hrajte a /hrajte_vedoucí)

// Added to Scout bot
import * as attendanceModule from './attendance';
attendanceModule; // Informace o docházce (commandy /docházka a /docházka_vedoucí)

// TULÁCI GUILD ID: 689451643468775550

// COMMAND NA PŘIPOJENÍ PYLON DO VOICE CHANNELU
discord.interactions.commands.register(
  {
    name: 'connect',
    description: 'Připojí Pylona do vašeho voice channelu',
  },
  async (interaction) => {
    const guild = await interaction.getGuild();

    const authorVoiceState = await guild.getVoiceState(
      interaction.member.user.id
    );
    if (!authorVoiceState) {
      interaction.respond('Nejprv se připojte do nějakého voice channelu');
      return;
    }

    guild.setOwnVoiceState({ channelId: authorVoiceState.channelId });

    interaction.respond('Pylon jest připojen');
  }
);

//pylon.tasks.cron('medvedi', '0 30 14 * * 3 ', async () => {
//const channelMedvedi = await discord.getGuildTextChannel(
//'689461844741587044'
//);
//if (!channelMedvedi) {
//return;
//}
//await channelMedvedi.sendMessage(
//'<@&689469952188481586>, máte za 30 minut schůzku. (Sraz je u Prádelny, pokud nebylo řečeno jinak)'
//);
//});

// MEDVĚDI ROLE ID: 689469952188481586

//pylon.tasks.cron('lisaci', '0 30 14 * * 5 ', async () => {
//const channelLisaci = await discord.getGuildTextChannel('689461902123991044');
//if (!channelLisaci) {
//return;
//}
//await channelLisaci.sendMessage(
//'<@&689470216052408353>, máte za 30 minut schůzku. (Sraz je u Prádelny, pokud nebylo řečeno jinak)'
//);
//});

//LIŠÁCI ROLE ID: 689470216052408353

//pylon.tasks.cron('kanata', '0 30 12 * * 6 ', async () => {
//const channelKanata = await discord.getGuildTextChannel('689461983640027143');
//if (!channelKanata) {
//return;
//}
//await channelKanata.sendMessage(
//'<@&689470397359718473>, máte za 30 minut schůzku. (Sraz je u Prádelny, pokud nebylo řečeno jinak)'
//);
//});

//KÁŃATA ROLE ID: 689470397359718473
