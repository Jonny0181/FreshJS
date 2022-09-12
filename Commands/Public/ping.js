const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
} = require("discord.js");
const { execute } = require("../../Events/Client/ready");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Will respond with pong!"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    interaction.reply({
      content: `Pong, took ${client.ws.ping}ms!`,
      ephemeral: true,
    });
  },
};
