const { Client, ChatInputCommandInteraction } = require("discord.js");
const { Player } = require("erela.js");
const favSongs = require("../../Schemas/favSongs");
const ConsoleLogger = require("../../Handlers/consoleLogger");
const logger = new ConsoleLogger();

module.exports = {
  id: "startFav",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const data = await favSongs.model.findOne({ _id: interaction.user.id });
    if (!data) {
      return interaction.reply({
        content: "You don't have any favorite songs!",
        ephemeral: true,
      });
    }
    interaction.reply({
      content: "Starting your favorite songs!",
      ephemeral: true,
    });
    const player = client.manager.get(interaction.guild.id);
    await startFavs(interaction, player, data.songs);
  },
};

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @param {Client} client
 * @param {Player} player
 * @param {Array} songs
 * @returns
 */
async function startFavs(interaction, player, songs) {
  const { guild, member, channel } = interaction;
  if (!member.voice.channel) {
    interaction.followUp(
      "<:tickNo:697759586538749982> You need to join a voice channel first."
    );
  }
  if (player && !guild.members.me.voice.channel) player.destroy();
  if (player && member.voice.channel !== guild.members.me.voice.channel) {
    return channel
      .send(
        "<:tickNo:697759586538749982> You need to be in the same voice channel as me."
      )
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
  try {
    player = guild.client.manager.create({
      guild: guild.id,
      textChannel: channel.id,
      voiceChannel: interaction.member.voice.channel.id,
      volume: 50,
      selfDeafen: true,
    });
  } catch (err) {
    if (err.message === "No avaliable nodes.") {
      return channel
        .send(
          "<:tickNo:697759586538749982> No avaliable nodes, try again later."
        )
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
    }
  }
  if (player.state !== "CONNECTED") player.connect();
  songs.forEach(async (value, index) => {
    let res;
    try {
      res = await player.search(value, interaction.member);
      let track;
      track = res.tracks[0];
      player.queue.add(track);
      if (!player.playing && !player.paused && !player.queue.size) {
        player.play();
      }
    } catch (err) {
      logger.error(err.message);
    }
  });
}
