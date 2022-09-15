const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  id: "startFav",
  developer: true,
  permission: PermissionFlagsBits.Administrator,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    interaction.reply({
      content: "This button is not completed yet!",
      ephemeral: true,
    });
  },
};
