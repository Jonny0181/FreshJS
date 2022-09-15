const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  TextChannel,
  Client,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const freshChannel = require("../../Schemas/freshChannel");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Enables or disables the Fresh music channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, channel, user } = interaction;
    const data = await freshChannel.model.findOne({ _id: guild.id });
    if (!data) {
      const newChannel = await guild.channels.create({
        type: TextChannel,
        name: "fresh-music",
        topic: "THIS IS IN BETA, PLEASE REPORT BUGS TO Jonny#0181",
      });
      const msg = await newChannel.send("Test");
      await freshChannel.add(guild, newChannel, msg, true);
      return interaction.reply({
        content: "Setup. Check console.",
        ephemeral: true,
      });
    } else {
      if (data.toggle === false) {
        const newChannel = await guild.channels.create({
          type: TextChannel,
          name: "fresh-music",
          topic: "THIS IS IN BETA, PLEASE REPORT BUGS TO Jonny#0181",
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
        const msg = await newChannel.send({
          embeds: [embed],
          components: [buttonRow],
        });

        const newData = {
          _id: guild.id,
          channelID: newChannel.id,
          messageID: msg.id,
          toggle: true,
        };
        await freshChannel.model.updateOne(
          { _id: guild.id },
          { $set: newData }
        );

        return interaction.reply({
          content: `I have enabled the music channel! Go check it out! <#${newChannel.id}>`,
          ephemeral: true,
        });
      } else {
        try {
          const mChannel = await client.channels.cache.get(data.channelID);
          await mChannel.delete();
        } catch (err) {
          console.log(
            `Failed to delete fresh-music channel for guild ${guild.name}`,
            err
          );
        }
        await freshChannel.model.updateOne(
          { _id: guild.id },
          { $set: { toggle: false } }
        );
        return interaction.reply({
          content: "I have disabled the music channel.",
          ephemeral: true,
        });
      }
    }
  },
};
