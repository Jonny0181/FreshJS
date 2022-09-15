const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

client.manager.on("trackStart", async (player, track) => {
  const channel = client.channels.cache.get(player.textChannel);
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
  embed = new EmbedBuilder()
    .setColor("Aqua")
    .setTitle("Now Playing:")
    .setDescription(`${track.title}\n${track.uri}`)
    .setFooter({ text: `Requested By: ${track.requester.username}` })
    .setThumbnail(track.thumbnail);
  const msg = await channel.send({ embeds: [embed] });
  player.set("npMsg", msg.id);
});
