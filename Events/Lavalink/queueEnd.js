const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const client = require("../../index");
const freshChannel = require("../../Schemas/freshChannel");
const ConsoleLogger = require("../../Handlers/consoleLogger");
const logger = new ConsoleLogger();

client.manager.on("queueEnd", async (player) => {
  const channel = client.channels.cache.get(player.textChannel);

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
    return playerMsg.first().edit({
      embeds: [embed],
      components: [buttonRow],
    });
  }

  const npMsg = player.get("npMsg");
  if (npMsg) {
    try {
      const msg = await channel.messages.fetch(npMsg);
      await msg.delete();
    } catch (error) {
      if (error.message === "Unknown Message") {
        return;
      } else {
        logger.error(error);
      }
    }
  }
  await channel.send("The queue has ended.");
  player.destroy();
});
