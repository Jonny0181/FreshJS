const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
} = require("discord.js");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song that is playing."),
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

    if (!player.queue.current) {
      return interaction.reply({
        content: "<:tickNo:697759586538749982> There is nothing playing.",
        ephemeral: true,
      });
    }

    player.stop();
    return interaction.reply({
      content: "<:tickYes:697759553626046546> Skipped.",
      ephemeral: true,
    });
  },
};
