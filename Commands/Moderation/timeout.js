const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const ConsoleLogger = require("../../Handlers/consoleLogger");
const logger = new ConsoleLogger();

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Puts a user in timeout.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to put into timeout.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("minutes")
        .setDescription("How long do they need to be in timeout?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason why you are putting them in timeout.")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, user, guild } = interaction;

    const target = options.getMember("user");
    const duration = options.getNumber("minutes");
    let reason = options.getString("reason");

    if (!reason) {
      reason = "No reason provided.";
    }

    if (target.id == user.id) {
      return interaction.reply({
        content: "You cannot put yourself in timeout.",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `Duration of timeout: \`${duration}\` minutes.\n**Reason:** ${reason}`
      )
      .setTitle(`You have been timed out in ${guild.name}`);

    try {
      await target.send({ embeds: [embed] });
    } catch {
      logger.error(
        `Timed out ${target.displayName} in ${guild.name}..but their dm's are off.`
      );
    }

    try {
      await target.timeout(duration * 60 * 1000, reason);
      return interaction.reply({
        content: `I have timed out ${target.displayName} for ${duration} minutes.`,
        ephemeral: true,
      });
    } catch (err) {
      return interaction.reply({
        content: `I have failed to timeout that user.\n${err}`,
        ephemeral: true,
      });
    }
  },
};
