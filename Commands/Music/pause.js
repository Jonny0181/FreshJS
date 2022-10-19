const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
} = require("discord.js");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current music."),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const { guild, member } = interaction;

    const player = client.manager.get(guild.id);

    if (!player) {
      return interaction.reply({
        content:
          "<:tickNo:697759586538749982> I'm not connected to any channel in this guild!",
        ephemeral: true,
      });
    }

    if (!member.voice.channel) {
      return interaction.reply({
        content:
          "<:tickNo:697759586538749982> You need to be in a voice channel.",
        ephemeral: true,
      });
    }

    if (member.voice.channel.id !== player.voiceChannel) {
      return interaction.reply({
        content:
          "<:tickNo:697759586538749982> You need to be in the same voice channel as me.",
        ephemeral: true,
      });
    }

    if (player.paused) {
      return interaction.reply({
        content: "<:tickNo:697759586538749982> The player is already paused.",
        ephemeral: true,
      });
    }

    player.pause(true);
    return interaction.reply({
      content: "<:tickYes:697759553626046546> Paused.",
      ephemeral: true,
    });
  },
};
