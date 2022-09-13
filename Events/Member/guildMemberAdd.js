const {
  EmbedBuilder,
  WebhookClient,
  GuildMember,
  Client,
} = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  /**
   *
   * @param {GuildMember} member
   * @param {Client} client
   */
  execute(member, client) {
    if (member.guild.id == "678226695190347797") {
      member.roles.add("682572975010087045");
      const Welcomer = new WebhookClient({
        id: "1018985092426764419",
        token: client.config.webhooks.welcomer,
      });

      const Welcome = new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({
          name: member.user.tag,
          iconURL: member.user.avatarURL({ dynamic: true, size: 512 }),
        })
        .setThumbnail(member.user.avatarURL({ dynamic: true, size: 512 }))
        .setDescription(
          `Welcome ${member} to **${
            member.guild.name
          }**!\nAccount Created: <t:${parseInt(
            member.user.createdTimestamp / 1000
          )}:R>\nLatest Member Count: **${member.guild.memberCount}**`
        )
        .setFooter({
          text: `ID: ${member.user.id}`,
        });

      Welcomer.send({ embeds: [Welcome] });
    }
  },
};
