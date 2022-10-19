const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const ConsoleLogger = require("../../Handlers/consoleLogger");
const logger = new ConsoleLogger();

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Play the given song name or link.")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { member, guild, channel } = interaction;
    interaction.deferReply({ ephemeral: true });

    if (!member.voice.channel) {
      return interaction.followUp({
        content:
          "<:tickNo:697759586538749982> You need to join a voice channel first.",
      });
    }

    let player = guild.client.manager.get(guild.id);

    if (player && !guild.members.me.voice.channel) player.destroy();
    if (player && member.voice.channel !== guild.members.me.voice.channel) {
      return interaction.followUp({
        content:
          "<:tickNo:697759586538749982> You need to be in the same voice channel as me.",
      });
    }

    try {
      player = guild.client.manager.create({
        guild: guild.id,
        textChannel: channel.id,
        voiceChannel: member.voice.channel.id,
        volume: 50,
        selfDeafen: true,
      });
    } catch (err) {
      if (err.message === "No avaliable nodes.") {
        return interaction.followUp({
          content:
            "<:tickNo:697759586538749982> No avaliable nodes, try again later.",
        });
      }
    }

    if (player.state !== "CONNECTED") player.connect();
    let res;

    try {
      res = await player.search(
        interaction.options.getString("query"),
        interaction.user
      );
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        throw res.exception;
      }
    } catch (err) {
      logger.error(err.message);
      return interaction.followUp({
        content:
          "<:tickNo:697759586538749982> There was an error while searching for your song.",
      });
    }

    let embed = new EmbedBuilder().setColor("Aqua");
    let track;

    switch (res.loadType) {
      case "NO_MATCHES": {
        if (!player.queue.current) player.destroy();
        return interaction.followUp({
          content: "<:tickNo:697759586538749982> Nothing was found.",
        });
      }
      case "TRACK_LOADED": {
        track = res.tracks[0];
        player.queue.add(track);
        if (!player.playing && !player.paused && !player.queue.size) {
          player.play();
          return interaction.followUp({
            content: "<:tickYes:697759553626046546> Added the song to queue.",
          });
        }
        embed
          .setAuthor({ name: "Added song to queue." })
          .setDescription(`${track.title}\n${track.uri}`)
          .setFooter({ text: `Requested By: ${track.requester.tag}` });
        if (typeof track.displayThumbnail === "function")
          embed.setThumbnail(track.displayThumbnail("hqdefault"));
        return interaction.followUp({
          embeds: [embed],
        });
      }
      case "PLAYLIST_LOADED": {
        player.queue.add(res.tracks);
        if (
          !player.playing &&
          !player.paused &&
          player.queue.totalSize === res.tracks.length
        ) {
          player.play();
        }
        embed
          .setAuthor({ name: "Added Playlist to queue" })
          .setDescription(res.playlist.name)
          .addFields({
            name: "Enqueued",
            value: `${res.tracks.length} songs`,
            inline: true,
          })
          .setFooter({ text: `Requested By: ${res.tracks[0].requester.tag}` });
        return interaction.followUp({
          embeds: [embed],
        });
      }
      case "SEARCH_RESULT": {
        track = res.tracks[0];
        player.queue.add(track);
        if (!player.playing && !player.paused && !player.queue.size) {
          player.play();
        }
        embed
          .setAuthor({ name: "Added Song to queue" })
          .setDescription(`${track.title}\n${track.uri}`)
          .setFooter({ text: `Requested By: ${track.requester.tag}` });
        return interaction.followUp({
          embeds: [embed],
        });
      }
    }
  },
};
