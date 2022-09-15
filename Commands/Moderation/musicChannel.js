const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const freshChannel = require("../../Schemas/freshChannel");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Enables or disables the Fresh music channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const { guild, channel, user } = interaction;
    const data = freshChannel.findOne({ guildID: guild.id });
    if (!data) {
      return interaction.reply({
        content: "This guild is not setup to use the music channel.",
      });
    } else {
      console.log(data);
      return interaction.reply({
        content: `Check console. Message ID: \`${data["message"]}\``,
      });
    }
  },
};
