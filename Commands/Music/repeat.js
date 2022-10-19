const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
} = require("discord.js");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("repeat")
    .setDescription(
      "Set the player to repeat the current queue or the current song."
    )
    .addStringOption((option) =>
      option
        .setName("repeat")
        .setDescription("Choose either queue or song.")
        .setRequired(true)
        .addChoices(
          { name: "queue", value: "queue" },
          { name: "song", value: "song" }
        )
    ),
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

    const choice = interaction.options.getString("repeat");
    switch (choice) {
      case "song": {
        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "Enabled" : "Disabled";
        return interaction.reply({
          content: `<:tickYes:697759553626046546> ${trackRepeat} track repeat.`,
          ephemeral: true,
        });
      }

      case "queue": {
        player.setQueueRepeat(!player.queueRepeat);
        const queueRepeat = player.queueRepeat ? "Enabled" : "Disabled";
        return interaction.reply({
          content: `<:tickYes:697759553626046546> ${queueRepeat} queue repeat.`,
          ephemeral: true,
        });
      }
    }
  },
};
