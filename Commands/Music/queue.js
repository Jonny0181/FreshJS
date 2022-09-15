const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the current music queue.")
    .addNumberOption((option) =>
      option.setName("page").setDescription("The page you want to show.")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const { guild, options } = interaction;

    const player = client.manager.get(guild.id);

    if (!player) {
      return interaction.reply({
        content:
          "<:tickNo:697759586538749982> I'm not connected to any channel in this guild!",
        ephemeral: true,
      });
    }

    const queue = player.queue;
    const embed = new EmbedBuilder();

    const multiple = 10;
    if (!options.getNumber("page")) page = 1;
    else page = options.getNumber("page");

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    if (queue.current) {
      embed.addFields([
        {
          name: "Current:",
          value: `${queue.current.title}\n${queue.current.uri}`,
        },
      ]);
      embed.setThumbnail(queue.current.thumbnail);
    }

    if (!tracks.length)
      embed.addFields([
        {
          name: "Up Next:",
          value: `No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`,
        },
      ]);
    else
      embed.addFields([
        {
          name: "Up Next:",
          value: tracks
            .map(
              (track, i) => `${start + ++i} - [${track.title}](${track.uri})`
            )
            .join("\n"),
        },
      ]);

    const maxPages = Math.ceil(queue.length / multiple);

    embed.setFooter({
      text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}`,
    });

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
