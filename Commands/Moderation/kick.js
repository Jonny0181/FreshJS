const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to kick from the server.")
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason why you are kicking the user.")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const { options, user } = interaction;

    const target = options.getMember("user");
    let reason = options.getString("reason");

    if (!reason) {
      reason = "No reason provided.";
    }
    if (reason.length > 512) {
      return interaction.reply({
        content: "The reason cannot exceed 512 characters.",
        ephemeral: true,
      });
    }

    if (target.id === user.id) {
      return interaction.reply({
        content: "You cannot kick yourself.",
        ephemeral: true,
      });
    }

    target.kick(reason);
    return interaction.reply({
      content: `I have kicked ${target.displayName} from the server.`,
      ephemeral: true,
    });
  },
};
