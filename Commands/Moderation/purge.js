const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription(
      "Deletes a specified number of messages from a channel or target."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages you want to delete.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The author of the messages you want to delete.")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { channel, options } = interaction;

    const amount = options.getNumber("amount");
    const target = options.getMember("target");

    const messages = await channel.messages.fetch();
    const response = new EmbedBuilder().setColor("Aqua");

    if (target) {
      let i = 0;
      const filtered = [];
      (await messages).filter((m) => {
        if (m.author.id === target.id && amount > i) {
          filtered.push(m);
          i++;
        }
      });

      await channel.bulkDelete(filtered, true).then((messages) => {
        response.setDescription(
          `🧹 Cleared ${messages.size} message(s) from ${target}.`
        );
        interaction.reply({
          embeds: [response],
        });
      });
    } else {
      await channel.bulkDelete(amount, true).then((messages) => {
        response.setDescription(
          `🧹 Cleared ${messages.size} message(s) from this channel.`
        );
        interaction.reply({
          embeds: [response],
        });
      });
    }
  },
};
