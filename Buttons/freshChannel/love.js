const {
  Client,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const favSongs = require("../../Schemas/favSongs");
const ConsoleLogger = require("../../Handlers/consoleLogger");
const logger = new ConsoleLogger();

module.exports = {
  id: "loveTrack",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const player = client.manager.get(interaction.guild.id);
    if (!player) {
      return interaction.reply({
        content:
          "This controller is outdated! Try playing the song again and then adding.",
        ephemeral: true,
      });
    }
    if (!player.queue.current) {
      return interaction.reply({
        content: "There is nothing playing!",
      });
    }
    const song = player.queue.current.uri;
    const data = await favSongs.model.findOne({ _id: interaction.user.id });
    if (!data) {
      await favSongs.model.create({
        _id: interaction.user.id,
        songs: [song],
      });
      return interaction.reply({
        content: "I have added the song to your liked songs!",
        ephemeral: true,
      });
    } else {
      const songs = data.songs;
      if (songs.includes(song)) {
        const buttonRow = new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setLabel("Yes")
            .setCustomId("favYes")
            .setEmoji("<:tickYes:697759553626046546>")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setLabel("No")
            .setCustomId("favNo")
            .setEmoji("<:tickNo:697759586538749982>")
            .setStyle(ButtonStyle.Danger),
        ]);

        const embed = new EmbedBuilder()
          .setColor("Aqua")
          .setDescription(
            "This songs seems to already be in your fav songs.\nWould you like to remove it?"
          )
          .setAuthor({
            name: interaction.member.displayName,
            iconURL: interaction.member.avatar,
          });

        await interaction.reply({
          embeds: [embed],
          components: [buttonRow],
        });

        const filter = (interaction) =>
          interaction.customId === "favYes" || "favNo";
        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 15_000,
        });
        collector.on("collect", async (i) => {
          switch (i.customId) {
            case "favYes": {
              await favSongs.model.findByIdAndUpdate(
                { _id: interaction.user.id },
                { $pull: { songs: song } }
              );
              return interaction.editReply({
                content: "I have removed the song from your favs!",
                embeds: [],
                components: [],
                ephemeral: true,
              });
            }
            case "favNo": {
              return interaction.editReply({
                content: "Okay, the song shall stay..",
                embeds: [],
                components: [],
                ephemeral: true,
              });
            }
          }
          setTimeout(() => 5000);
          collector.emit("end");
        });
        collector.on(
          "end",
          async (collected) => await interaction.deleteReply()
        );
      } else {
        await favSongs.model.findByIdAndUpdate(
          { _id: interaction.user.id },
          { $push: { songs: song } }
        );
        return interaction.reply({
          content: "I have added the song to your liked songs!",
          ephemeral: true,
        });
      }
    }
  },
};
