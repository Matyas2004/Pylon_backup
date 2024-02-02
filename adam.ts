let adam = discord.on('MESSAGE_CREATE', async (message) => {
  // If message contains 'adam' and is not one of the emotes
  if (
    message.content.toLowerCase().includes('adam') &&
    !message.content.toLocaleLowerCase().includes('1000') &&
    !message.content.toLocaleLowerCase().includes('bad') &&
    !message.content.toLocaleLowerCase().includes('approved') &&
    !message.content.toLocaleLowerCase().includes('think')
  ) {
    await message.reply(
      "O kom to mluvíte? Adam? Možná existuje, možná ne, we'll never know"
    );
  }
});

export { adam };
