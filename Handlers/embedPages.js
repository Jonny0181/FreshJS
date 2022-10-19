const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  embedPages: async (interaction, embeds) => {
    const pages = {};
    const getRow = (id) => {
      const row = new ActionRowBuilder();

      row.addComponents(
        new ButtonBuilder()
          .setLabel("◀")
          .setCustomId("prevPage")
          .setStyle(ButtonStyle.Success)
          .setDisabled(pages[id] === 0)
      );

      row.addComponents(
        new ButtonBuilder()
          .setLabel("▶")
          .setCustomId("nextPage")
          .setStyle(ButtonStyle.Success)
          .setDisabled(pages[id] === embeds.length - 1)
      );
      return row;
    };

    const id = interaction.user.id;
    pages[id] = pages[id] || 0;
    let Pagemax = embeds.length;

    const embed = embeds[pages[id]];

    await embeds[pages[id]].setFooter({
      text: `Page ${pages[id] + 1} from ${Pagemax}`,
    });

    const replyEmbed = await interaction.reply({
      embeds: [embed],
      components: [getRow(id)],
      fetchReply: true,
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const time = 1000 * 60 * 5;

    const collector = await replyEmbed.createMessageComponentCollector({
      filter,
      time,
    });

    collector.on("collect", async (b) => {
      if (!b) return;
      if (b.customId !== "prevPage" && b.customId !== "nextPage") return;

      b.deferUpdate();

      if (b.customId === "prevPage" && pages[id] > 0) {
        --pages[id];
      } else if (b.customId === "nextPage" && pages[id] < embeds.length - 1) {
        ++pages[id];
      }

      await embeds[pages[id]].setFooter({
        text: `Page ${pages[id] + 1} of ${Pagemax}`,
      });

      await interaction.editReply({
        embeds: [embeds[pages[id]]],
        components: [getRow(id)],
        fetchReply: true,
      });
    });
  },
};
