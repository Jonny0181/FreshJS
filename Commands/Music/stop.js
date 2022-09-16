const {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the music and destroys the player."),
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
        console.log(error);
      }
    }

    player.destroy();
    return interaction.reply({
      content: "<:tickYes:697759553626046546> Stopped the music.",
      ephemeral: true,
    });
  },
};
