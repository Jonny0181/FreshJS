const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const util = require("util");

module.exports = {
  developer: true,
  category: "dev",
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate code.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code to evaluate.")
        .setRequired(true)
    ),
  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const code = options.getString("code");
    let response;
    try {
      const output = eval(code);
      evaluated = util
        .inspect(output, { depth: 0 })
        .replaceAll(client.token, "You thought bruh..");
      response = new EmbedBuilder()
        .setAuthor({ name: "Output:" })
        .setDescription(
          "```js\n" +
            (evaluated.length > 4096
              ? `${evaluated.substr(0, 4000)}...`
              : evaluated) +
            "\n```"
        )
        .setColor("Green")
        .setTimestamp(Date.now());
      return interaction.reply({ embeds: [response] });
    } catch (err) {
      const response = new EmbedBuilder()
        .setColor("Red")
        .setAuthor({ name: "Error:" })
        .setDescription(
          "```js\n" +
            (err.length > 4096 ? `${err.substr(0, 4000)}...` : err) +
            "\n```"
        )
        .setTimestamp(Date.now());
      return interaction.reply({ embeds: [response] });
    }
  },
};
