const { REST, Routes } = require("discord.js");

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Clearing GUILD commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        "1500616659910656020",
        "1500575733586591825"
      ),
      { body: [] }
    );

    console.log("Guild commands cleared");
  } catch (err) {
    console.error(err);
  }
})();
