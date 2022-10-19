const {
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const freshChannel = require("../../Schemas/freshChannel");

module.exports = {
  id: "stopPlayer",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, member, channel } = interaction;
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

    const npMsg = player.get("npMsg");
    try {
      if (npMsg) {
        const msg = await channel.messages.fetch(npMsg);
        await msg.delete();
      }
    } catch (error) {
      if (error.message === "Unknown Message") {
        return;
      } else {
        logger.error(error);
      }
    }

    const data = await freshChannel.model.findOne({ _id: channel.guild.id });
    if (channel.id == data.channelID) {
      const playerMsg = await channel.messages.fetch({
        around: data.messageID,
        limit: 1,
      });

      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("startFav")
          .setLabel("Start My Favorites")
          .setStyle(ButtonStyle.Success)
      );

      const embed = new EmbedBuilder()
        .setAuthor({ iconURL: client.user.avatarURL(), name: "Fresh Music" })
        .setColor("Aqua")
        .setDescription(
          "Send a song link or query to start playing music!\nOr click the button to start you favorite songs!"
        )
        .setImage("https://i.imgur.com/VIYaATs.jpg");

      player.destroy();
      playerMsg.first().edit({
        embeds: [embed],
        components: [buttonRow],
      });
    }

    player.destroy();
    return interaction.reply({
      content: "<:tickYes:697759553626046546> Stopped the music.",
      ephemeral: true,
    });
  },
};
