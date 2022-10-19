const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");

module.exports = {
  developer: true,
  category: "dev",
  data: new SlashCommandBuilder()
    .setName("commands")
    .setDescription("Manage the bots application commands.")
    .addSubcommand((option) =>
      option
        .setName("delete")
        .setDescription("Deleted a slash command from the client application.")
        .addStringOption((option) =>
          option
            .setName("command-id")
            .setDescription(
              "The ID of the application command you are trying to delete."
            )
            .setRequired(true)
        )
    ),
};
