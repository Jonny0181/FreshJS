const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const Config = require("../../Schemas/freshChannel");

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
    const data = Config.findOne({ guildID: guild.id });
    if (!data["channelID"]) {
      return interaction.reply({
        content: "Music channel is not setup.",
      });
    } else {
      console.log(data);
      return interaction.reply({
        content: "Check console.",
      });
    }
  },
};
