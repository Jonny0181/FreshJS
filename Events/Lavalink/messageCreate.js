const {
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
} = require("discord.js");
const { Player } = require("erela.js");
const humanizeDuration = require("humanize-duration");
const freshChannel = require("../../Schemas/freshChannel");
const ConsoleLogger = require("../../Handlers/consoleLogger");
const logger = new ConsoleLogger();

var httpRegex =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g;

module.exports = {
  name: "messageCreate",
  once: false,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const { channel, author } = message;
    const data = await freshChannel.model.findOne({ _id: message.guild.id });

    if (!data) return;
    if (author.bot) return;

    const channelID = data.channelID;
    const messageID = data.messageID;
    const toggle = data.toggle;
    let playerMsg = await channel.messages.fetch({
      around: messageID,
      limit: 1,
    });
    playerMsg = playerMsg.first();

    if (toggle === true) {
      const player = client.manager.get(channel.guild.id);

      if (channel.id == channelID) {
        message.delete();
        switch (message.content) {
          case "skip": {
            return await skip(message, player);
          }
          case "stop": {
            return await stop(message, client, player, playerMsg);
          }
          case "shuffle": {
            return await shuffle(message, client, player, playerMsg);
          }
        }
        if (message.content.match(httpRegex)) {
          return await play(message, client, player, playerMsg);
        } else {
          return await play(message, client, player, playerMsg);
        }
      }
    }
  },
};

async function shuffle(message, client, player, playerMsg) {
  if (!player) {
    return message.channel
      .send(
        "<:tickNo:697759586538749982> I'm not connected to any channel in this guild!"
      )
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
  if (!message.member.voice.channel) {
    return message.channel
      .send("<:tickNo:697759586538749982> You need to be in a voice channel.")
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
  if (message.member.voice.channel.id !== player.voiceChannel) {
    return message.channel
      .send(
        "<:tickNo:697759586538749982> You need to be in the same voice channel as me."
      )
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
  if (!player.queue.current) {
    return channel
      .send("<:tickNo:697759586538749982> There is nothing playing.")
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
  player.queue.shuffle();
  message.channel
    .send("<:tickYes:697759553626046546> Shuffled.")
    .then((msg) => {
      setTimeout(() => msg.delete(), 5000);
    });
  return await updatePlayerMsg("queued", client, player, playerMsg);
}

async function stop(message, client, player, playerMsg) {
  if (!player) {
    return message.channel
      .send(
        "<:tickNo:697759586538749982> I'm not connected to any channel in this guild!"
      )
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
  if (!message.member.voice.channel) {
    return message.channel
      .send("<:tickNo:697759586538749982> You need to be in a voice channel.")
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
  if (message.member.voice.channel.id !== player.voiceChannel) {
    return message.channel
      .send(
        "<:tickNo:697759586538749982> You need to be in the same voice channel as me."
      )
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
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
  player.destroy();
  message.channel
    .send("<:tickYes:697759553626046546> Stopped the music.")
    .then((msg) => {
      setTimeout(() => msg.delete(), 5000);
    });
  return await updatePlayerMsg("default", client, player, playerMsg);
}

async function skip(message, player) {
  if (!player) {
    return message.channel
      .send(
        "<:tickNo:697759586538749982> I'm not connected to any channel in this guild!"
      )
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
  if (!message.member.voice.channel) {
    return message.channel
      .send("<:tickNo:697759586538749982> You need to be in a voice channel.")
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
  if (message.member.voice.channel.id !== player.voiceChannel) {
    return message.channel
      .send(
        "<:tickNo:697759586538749982> You need to be in the same voice channel as me."
      )
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
  if (!player.queue.current) {
    return message.channel
      .send("<:tickNo:697759586538749982> There is nothing playing.")
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
  player.stop();
  return message.channel
    .send("<:tickYes:697759553626046546> Skipped.")
    .then((msg) => {
      setTimeout(() => msg.delete(), 5000);
    });
}

/**
 *
 * @param {Message} message
 * @param {Client} client
 * @param {Player} player
 * @param {Message} playerMsg
 * @returns
 */
async function play(message, client, player, playerMsg) {
  const { guild, member, channel } = message;
  if (!member.voice.channel) {
    return channel
      .send(
        "<:tickNo:697759586538749982> You need to join a voice channel first."
      )
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
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
      voiceChannel: member.voice.channel.id,
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
  let res;
  try {
    res = await player.search(message.content, member);
    if (res.loadType === "LOAD_FAILED") {
      if (!player.queue.current) player.destroy();
      throw res.exception;
    }
  } catch (err) {
    console.log(err);
    return channel
      .send(
        "<:tickNo:697759586538749982> There was an error while searching for your song."
      )
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
  let embed = new EmbedBuilder().setColor("Aqua");
  let track;
  switch (res.loadType) {
    case "NO_MATCHES": {
      if (!player.queue.current) player.destroy();
      return channel
        .send("<:tickNo:697759586538749982> Nothing was found.")
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
    }
    case "TRACK_LOADED": {
      track = res.tracks[0];
      player.queue.add(track);
      if (!player.playing && !player.paused && !player.queue.size) {
        player.play();
      }
      embed
        .setAuthor({ name: "Added song to queue." })
        .setDescription(`${track.title}\n${track.uri}`)
        .setFooter({ text: `Requested By: ${track.requester.displayName}` });
      if (typeof track.displayThumbnail === "function")
        embed.setThumbnail(track.displayThumbnail("hqdefault"));
      channel
        .send({
          embeds: [embed],
        })
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
      return await updatePlayerMsg("queued", client, player, playerMsg);
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
        .setFooter({
          text: `Requested By: ${res.tracks[0].requester.displayName}`,
        });
      channel
        .send({
          embeds: [embed],
        })
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
      return await updatePlayerMsg("queued", client, player, playerMsg);
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
        .setFooter({ text: `Requested By: ${track.requester.displayName}` });
      channel
        .send({
          embeds: [embed],
        })
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
      return await updatePlayerMsg("queued", client, player, playerMsg);
    }
  }
}

async function updatePlayerMsg(mode, client, player, playerMsg) {
  switch (mode) {
    case "queued": {
      if (player.queue.size > 0) {
        if (player.queue.size > 5) return;
        const queue = player.queue;
        const end = 1 * 5;
        const start = end - 5;
        const queueTracks = queue.slice(start, end);

        embed = new EmbedBuilder()
          .setColor("Aqua")
          .addFields(
            {
              name: "Currently Playing:",
              value: `${player.queue.current.title}\n${player.queue.current.uri}`,
              inline: false,
            },
            {
              name: "Author:",
              value: `${player.queue.current.author}`,
              inline: true,
            },
            {
              name: "Duration:",
              value: `${humanizeDuration(player.queue.current.duration)}`,
              inline: true,
            }
          )
          .setImage(
            `https://img.youtube.com/vi/${player.queue.current.identifier}/hqdefault.jpg`
          )
          .setFooter({
            text: `Requested By: ${player.queue.current.requester.displayName}`,
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
        return await playerMsg.edit({ embeds: [embed] });
      }
    }
    case "default": {
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
      return await playerMsg.edit({ embeds: [embed], components: [buttonRow] });
    }
  }
}
