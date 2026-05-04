const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Test bot"),

  new SlashCommandBuilder()
    .setName("link")
    .setDescription("Link your Epic Games account")
    .addStringOption(option =>
      option.setName("epic")
        .setDescription("Your Epic username")
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering commands...");

    await rest.put(
      Routes.applicationCommands("1500616659910656020"),
      { body: commands }
    );

    console.log("Commands registered successfully!");
  } catch (error) {
    console.error(error);
  }
})();
