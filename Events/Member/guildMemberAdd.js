const { EmbedBuilder, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  /**
   *
   * @param {GuildMember} member
   */
  execute(member) {
    if (member.guild.id == "678226695190347797") {
      member.roles.add("682572975010087045");
      const Welcomer = new WebhookClient({
        id: "1018985092426764419",
        token: client.config.webhooks.welcomer,
      });

      const Welcome = new EmbedBuilder()
        .setColor("Aqua")
        .setAuthor(
          member.user.tag,
          member.user.avatarURL({ dynamic: true, size: 512 })
        )
        .setThumbnail(member.user.avatarURL({ dynamic: true, size: 512 }))
        .setDescription(
          `
      Welcome ${member} to the **${member.guild.name}**!\n
      Account Created: <t:${parseInt(member.user.createdTimestamp / 1000)}:R>\n
      Latest Member Count: **${member.guild.memberCount}**`
        )
        .setFooter(`ID: ${member.user.id}`);

      Welcomer.send({ embeds: [Welcome] });
    }
  },
};
