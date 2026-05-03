client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.deferReply(); // acknowledges instantly
    await interaction.editReply("Pong 🏓");
  }
});
