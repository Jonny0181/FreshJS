const client = require("../../index");

client.manager.on("queueEnd", async (player) => {
  const channel = client.channels.cache.get(player.textChannel);
  const npMsg = player.get("npMsg");
  if (npMsg) {
    try {
      const msg = await channel.messages.fetch(npMsg);
      await msg.delete();
    } catch (error) {
      if (error.message === "Unknown Message") {
        return;
      } else {
        console.log(error);
      }
    }
  }
  await channel.send("The queue has ended.");
  player.destroy();
});
