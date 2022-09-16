const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user from the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason why you are banning this user.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("messages")
        .setDescription("The amount of message history you want to delete.")
        .setRequired(true)
        .addChoices(
          { name: "Don't delete any.", value: "0" },
          { name: "Previous 7 days.", value: "7" }
        )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const { guild, channel, user, options } = interaction;

    const target = options.getMember("user");
    if (target.id === user.id) {
      return interaction.reply({
        content: "You cannot ban yourself.",
        ephemeral: true,
      });
    }

    const reason = options.getString("reason");
    if (reason.length > 512) {
      return interaction.reply({
        content: "The reason cannot exceed 512 characters.",
        ephemeral: true,
      });
    }

    const amount = options.getString("messages");
    target.ban({
      days: amount,
      reason: reason,
    });

    return interaction.reply({
      content: `${target.user.username} has been banned.`,
      ephemeral: true,
    });
  },
};
