const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.command.name);
    if (!command)
      return interaction.reply({
        content: "This command is outdated!",
        ephemeral: true,
      });

    if (command.developer && interaction.user.id !== "827940585201205258")
      return interaction.reply({
        content: "This command is only avaliable to the developer!",
        ephemeral: true,
      });

    command.execute(interaction, client);
  },
};
