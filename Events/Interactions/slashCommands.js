const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    try {
      command = client.commands.get(interaction.command.name);
    } catch {
      return interaction.reply({
        content: "This command is outdated!",
        ephemeral: true,
      });
    }
    if (!command) {
      return interaction.reply({
        content: "This command is outdated!",
        ephemeral: true,
      });
    }

    if (command.developer && interaction.user.id !== "827940585201205258") {
      return interaction.reply({
        content: "This command is only avaliable to the developer!",
        ephemeral: true,
      });
    }

    const subCommand = interaction.options.getSubcommand(false);
    if (subCommand) {
      const subCommandFile = client.subCommands.get(
        `${interaction.commandName}.${subCommand}`
      );
      if (!subCommandFile) {
        return interaction.reply({
          content: "This subcommand is outdated!",
          ephemeral: true,
        });
      }
      subCommandFile.execute(interaction, client);
    } else command.execute(interaction, client);
  },
};
