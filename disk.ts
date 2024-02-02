let hodDisk = discord.on('MESSAGE_CREATE', async (message) => {
  if (
    message.content.toLowerCase().includes('hoď disk') ||
    message.content.toLowerCase().includes('hod disk')
  ) {
    await message.reply('Chyť míč');
  }
});

export { hodDisk };
