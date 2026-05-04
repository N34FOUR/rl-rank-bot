const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const userLinks = new Map();

const ranks = [
  { name: "Bronze", color: 0x6b4f3a },
  { name: "Silver", color: 0xb0b0b0 },
  { name: "Gold", color: 0xffd700 },
  { name: "Platinum", color: 0x00e5ff },
  { name: "Diamond", color: 0x3b82f6 },
  { name: "Champion", color: 0x8b5cf6 },
  { name: "Grand Champion", color: 0xff4d4d },
  { name: "SSL", color: 0xffffff }
];
async function assignRankRole(member, rankName) {
  const guild = member.guild;

  // remove old rank roles
  const allRankNames = ranks.map(r => r.name);

  member.roles.cache.forEach(role => {
    if (allRankNames.includes(role.name)) {
      member.roles.remove(role);
    }
  });

  // add new role
  const newRole = guild.roles.cache.find(r => r.name === rankName);

  if (newRole) {
    await member.roles.add(newRole);
  }
}
function getRankFromData(data) {
  const segments = data?.data?.segments || [];

  const ranked = segments.find(s =>
    s.metadata?.name?.toLowerCase().includes("ranked")
  );

  const tier = ranked?.stats?.tier?.displayValue;

  if (!tier) return "Unranked";

  const map = {
    "Bronze": "Bronze",
    "Silver": "Silver",
    "Gold": "Gold",
    "Platinum": "Platinum",
    "Diamond": "Diamond",
    "Champion": "Champion",
    "Grand Champion": "Grand Champion",
    "Supersonic Legend": "SSL"
  };

  for (const key in map) {
    if (tier.includes(key)) return map[key];
  }

  return "Unranked";
}
async function getRLStats(epicName) {
  try {
    const res = await axios.get(
      `https://public-api.tracker.gg/v2/rocket-league/standard/profile/epic/${epicName}`,
      {
        headers: {
          Accept: "application/json"
        },
        timeout: 8000
      }
    );

    return res.data;
  } catch (err) {
    console.log("RL fetch failed:", err.message);
    return null;
  }
}

async function setupRoles(guild) {
  for (const rank of ranks) {
    let role = guild.roles.cache.find(r => r.name === rank.name);

    if (!role) {
      role = await guild.roles.create({
        name: rank.name,
        color: rank.color,
        reason: "Rocket League rank roles"
      });

      console.log(`Created role: ${rank.name}`);
    }
  }
}

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  client.guilds.cache.forEach(async (guild) => {
    await setupRoles(guild);
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    return interaction.reply("Pong 🏓");
  }

  if (interaction.commandName === "link") {
    const epic = interaction.options.getString("epic");

    await interaction.reply(`Checking stats for **${epic}**...`);

    const data = await getRLStats(epic);

    if (!data) {
      return interaction.followUp("Could not fetch Rocket League stats.");
    }

    const rank = getRankFromData(data);

    userLinks.set(interaction.user.id, { epic, rank });

    await assignRankRole(interaction.member, rank);

    await interaction.followUp(
      `Linked **${epic}**\nAssigned Rank Role: **${rank}**`
    );
  }
});

// 👇 THIS MUST EXIST
client.login(process.env.TOKEN);
