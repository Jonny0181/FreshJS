const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
} = require("discord.js");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Changes the volume of the current music.")
    .addNumberOption((option) =>
      option.setName("volume").setDescription("Specify a number between 1-100.")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const { guild, member, options } = interaction;

    const volume = options.getNumber("volume");
    const player = client.manager.get(guild.id);

    if (!player) {
      return interaction.reply({
        content:
          "<:tickNo:697759586538749982> I'm not connected to any channel in this guild!",
        ephemeral: true,
      });
    }

    if (!volume) {
      return interaction.reply({
        content: `🔊 Current Volume: \`${player.volume}%\``,
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

    if (!volume || volume < 1 || volume > 100) {
      return interaction.reply({
        content:
          "<:tickNo:697759586538749982> You need to give me a number between 1-100.",
        ephemeral: true,
      });
    }

    player.setVolume(volume);
    return interaction.reply({
      content: `🔊 Set the volume to: \`${volume}\``,
      ephemeral: true,
    });
  },
};
