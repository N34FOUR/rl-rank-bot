const { REST, Routes } = require("discord.js");

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Clearing GLOBAL commands...");

    await rest.put(
      Routes.applicationCommands("1500616659910656020"),
      { body: [] }
    );

    console.log("Global commands cleared");
  } catch (err) {
    console.error(err);
  }
})();
