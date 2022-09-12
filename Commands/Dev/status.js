const {
  Client,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");
const { connection } = require("mongoose");
require("../../Events/Client/ready");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription(
      "Displays the status of the client and database connection."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const clientStatus = `Status: Online\nPing: ${
      client.ws.ping
    }ms\nUptime: <t:${parseInt(client.readyTimestamp / 1000)}:R>`;
    const dbStatus = `Status: ${switchTo(connection.readyState)}\nCollection: ${
      client.config.database.collection
    }`;
    const Response = new EmbedBuilder()
      .setColor("Aqua")
      .setThumbnail(client.user.avatarURL())
      .addFields([
        {
          name: "Client:",
          value: clientStatus,
        },
        {
          name: "Database:",
          value: dbStatus,
        },
      ]);

    return interaction.reply({
      embeds: [Response],
    });
  },
};

function switchTo(val) {
  var status = " ";
  switch (val) {
    case 0:
      status = `🔴 Disconnected`;
      break;
    case 1:
      status = `🟢 Connected`;
      break;
    case 2:
      status = `🟠 Connecting`;
      break;
    case 3:
      status = `🟣 Disconnecting`;
      break;
  }
  return status;
}
