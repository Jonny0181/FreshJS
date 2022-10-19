const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  developer: true,
  category: "dev",
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads a your commands or events.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((option) =>
      option.setName("events").setDescription("Reload your events.")
    )
    .addSubcommand((option) =>
      option.setName("commands").setDescription("Reload your commands.")
    ),
};
