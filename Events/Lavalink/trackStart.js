const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const client = require("../../index");
const humanizeDuration = require("humanize-duration");
const freshChannel = require("../../Schemas/freshChannel");
const ConsoleLogger = require("../../Handlers/consoleLogger");
const logger = new ConsoleLogger();

client.manager.on("trackStart", async (player, track) => {
  const channel = client.channels.cache.get(player.textChannel);

  const data = await freshChannel.model.findOne({ _id: channel.guild.id });
  if (channel.id == data.channelID) {
    const playerMsg = await channel.messages.fetch({
      around: data.messageID,
      limit: 1,
    });

    const queue = player.queue;
    const end = 1 * 5;
    const start = end - 5;
    const queueTracks = queue.slice(start, end);

    const embed = new EmbedBuilder()
      .setColor("Aqua")
      .addFields(
        {
          name: "Currently Playing:",
          value: `${track.title}\n${track.uri}`,
          inline: false,
        },
        { name: "Author:", value: `${track.author}`, inline: true },
        {
          name: "Duration:",
          value: `${humanizeDuration(track.duration)}`,
          inline: true,
        }
      )
      .setImage(`https://img.youtube.com/vi/${track.identifier}/hqdefault.jpg`)
      .setFooter({
        text: `Requested By: ${track.requester.displayName}`,
      });

    if (!queueTracks.length)
      embed.addFields([
        {
          name: "Up Next:",
          value: `No tracks in the queue.`,
        },
      ]);
    else
      embed.addFields([
        {
          name: "Up Next:",
          value: queueTracks
            .map((track, i) => `\`${start + ++i}.\` ${track.title}`)
            .join("\n"),
        },
      ]);

    const buttons = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setLabel("Love")
        .setEmoji("🤍")
        .setCustomId("loveTrack")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setLabel("Pause/Resume")
        .setEmoji("<:pause:1010305240672780348>")
        .setCustomId("pauseTrack")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setLabel("Skip")
        .setEmoji("<:skip:1010321396301299742>")
        .setCustomId("skipTrack")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setLabel("Stop")
        .setEmoji("<:stop:1010325505179918468>")
        .setCustomId("stopPlayer")
        .setStyle(ButtonStyle.Danger),
    ]);

    return await playerMsg.first().edit({
      content: "",
      embeds: [embed],
      components: [buttons],
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
  embed = new EmbedBuilder()
    .setColor("Aqua")
    .setTitle("Now Playing:")
    .setDescription(`${track.title}\n${track.uri}`)
    .setFooter({ text: `Requested By: ${track.requester.username}` })
    .setThumbnail(track.thumbnail);
  const msg = await channel.send({ embeds: [embed] });
  player.set("npMsg", msg.id);
});
