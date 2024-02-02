//NENÍ ZMĚNĚNÉ DO PODOBY SLASH COMMANDU

const testCommands = new discord.command.CommandGroup({
  defaultPrefix: '!', // You can customize your default prefix here.
});

testCommands.raw('test', async (message, {}) => {
  const richEmbed = new discord.Embed({
    title: 'Podmínky schůzek',
    color: 0xff0000,
    description: 'Co je potřebné mít a dodržovat na schůzkách',
    thumbnail: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SARS-CoV-2_without_background.png/225px-SARS-CoV-2_without_background.png',
    },
    //footer: {
    //text:
    //  'Test musí mít i lidé pod 12 let. Pro všechny očkované či mladší než 18 let jsou testy i nadále zdarma.'
    //}
  });
  richEmbed.addField({
    name: 'Družinové schůzky',
    value: `Bezinfekčnost: Není třeba,
Roušky/Respirátory: Je potřeba je nosit ve vnitřních prostorech`,
  });
  richEmbed.addField({
    name: 'Oddílové schůzky nebo výpravy',
    value: `Bezinfekčnost: Je potřeba
Roušky/Respirátory: Je potřeba je nosit ve vnitřních prostorech`,
  });
  //richEmbed.addField({
  //name: 'Schůzky od 20 do 30 osob:',
  //value: `Bezinfekčnost: Ano
  //Roušky uvnitř: Ano*
  //Roušky venku: Nejsou třeba`,
  //inline: false
  //});
  //richEmbed.addField({
  //name: 'Schůzky nad 20 osob:',
  //value: `Bezinfekčnost: Ano`,
  //inline: false
  //});

  richEmbed.addField({
    name: 'Jak získat bezinfekčnost?',
    value: `Mít 14 dní po obou dávkách očkování
  Mít méně než 180 dní po prvním pozitivním testu na Covid
  Pouze pro členy do 18 let pak max. 3 dny starý PCR test a to formou:
  Testu ze školy (jen pokud se testujete PCR - lze doložit [čestným prohlášením](https://docs.google.com/document/d/1mYDceO-sE4Fu3GeB-dMooguBN1srpyyaEXVI7iMubCI/edit))
  Nebo testu z veřejného odběrového místa, na Zbraslavi [poblíž zastávky Žabovřesky](https://www.covidpass.cz/COVIDPass/action/CVPersonTestRequest_Order/90/?actionId=21225822641477096&ts=1620556761262&hash=da1qSDn4iKw8NxbqZ3owHizOrGXUpi9FDrD4xMDTSic=&nbl=true&uselastresult=true&_browserSessionID=&lang=cs-CZ) či [na ulici Žitavského naproti poliklinice](https://reservatic.com/cs/public_services/synlab-czech-s-r-o-praha-zitavskeho)
  Antigenní test již kvůli horší epidemické situaci NEPLATÍ`,
  });

  message.reply(richEmbed);
});

export { testCommands };
