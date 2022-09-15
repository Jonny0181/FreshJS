const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    const button = client.buttons.get(interaction.customId);

    if (!button) return;

    if (button == undefined) return;

    if (
      button.permission &&
      !interaction.member.permissions.has(button.permission)
    )
      return interaction.reply({
        content: "You don't have the required permissions to use this.",
        ephemeral: true,
      });

    if (button.developer && interaction.user.id !== "827940585201205258") {
      return interaction.reply({
        content: "This command is only avaliable to the developer!",
        ephemeral: true,
      });
    }

    button.execute(interaction, client);
  },
};
