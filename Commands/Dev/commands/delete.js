const { ChatInputCommandInteraction, Client } = require("discord.js");
const ConsoleLogger = require("../../../Handlers/consoleLogger");
const logger = new ConsoleLogger();

module.exports = {
  subCommand: "commands.delete",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      const cmdID = interaction.options.getString("command-id");
      const cmd = await client.application.commands.fetch(cmdID);
      if (cmd) {
        await cmd.delete();
      }

      return await interaction.reply({
        content: `I have deleted the command \`${cmd.name}\`!`,
        ephemeral: true,
      });
    } catch (err) {
      logger.error(err);
      return interaction.reply({
        content:
          "This command doesn't seem to exist? Make sure the ID is copied correctly.",
        ephemeral: true,
      });
    }
  },
};
