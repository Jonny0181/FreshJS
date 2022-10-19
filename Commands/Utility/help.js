const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Client,
} = require("discord.js");
const { embedPages } = require("../../Handlers/embedPages");

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get all the bot's commands."),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    musicCmds = [];
    utilityCmds = [];
    modCmds = [];
    devCmds = [];
    const modules = ["Music", "Developer", "Utility", "Moderation"];
    client.commands.map((cmd) => {
      if (cmd.category == "music") {
        musicCmds.push({ name: cmd.data.name, desc: cmd.data.description });
      }
      if (cmd.category == "utility") {
        utilityCmds.push({ name: cmd.data.name, desc: cmd.data.description });
      }
      if (cmd.category == "moderation") {
        modCmds.push({ name: cmd.data.name, desc: cmd.data.description });
      }
      if (cmd.category == "dev") {
        devCmds.push({ name: cmd.data.name, desc: cmd.data.description });
      }
    });

    const embeds = [];

    // All commands..
    const mainPage = new EmbedBuilder()
      .setColor("Aqua")
      .setAuthor({
        name: "All commands:",
        iconURL: client.user.avatarURL({ dynamic: true, size: 512 }),
      })
      .addFields([
        { name: "Music", value: `${musicCmds.map((cmd) => ` ${cmd.name}`)}` },
        {
          name: "Moderation",
          value: `${modCmds.map((cmd) => ` ${cmd.name}`)}`,
        },
        {
          name: "Utility",
          value: `${utilityCmds.map((cmd) => ` ${cmd.name}`)}`,
        },
        {
          name: "Developer",
          value: `${devCmds.map((cmd) => ` ${cmd.name}`)}`,
        },
      ]);
    embeds.push(mainPage);

    // Developer Commands...
    const devPage = new EmbedBuilder().setColor("Aqua").setAuthor({
      name: `Commands for module Developer:`,
      iconURL: client.user.avatarURL({ dynamic: true, size: 512 }),
    });
    devDesc = "";
    for (cmd in devCmds) {
      devDesc += `\`${devCmds[cmd]["name"]}\` - ${devCmds[cmd]["desc"]}\n`;
    }
    devPage.setDescription(devDesc);
    embeds.push(devPage);

    // Utility Commands...
    const utilPage = new EmbedBuilder().setColor("Aqua").setAuthor({
      name: `Commands for module Utility:`,
      iconURL: client.user.avatarURL({ dynamic: true, size: 512 }),
    });
    utilDesc = "";
    for (cmd in utilityCmds) {
      utilDesc += `\`${utilityCmds[cmd]["name"]}\` - ${utilityCmds[cmd]["desc"]}\n`;
    }
    utilPage.setDescription(utilDesc);
    embeds.push(utilPage);

    // Music Commands...
    const musicPage = new EmbedBuilder().setColor("Aqua").setAuthor({
      name: `Commands for module Music:`,
      iconURL: client.user.avatarURL({ dynamic: true, size: 512 }),
    });
    musicDesc = "";
    for (cmd in musicCmds) {
      musicDesc += `\`${musicCmds[cmd]["name"]}\` - ${musicCmds[cmd]["desc"]}\n`;
    }
    musicPage.setDescription(musicDesc);
    embeds.push(musicPage);

    // Moderation Commands...
    const modPage = new EmbedBuilder().setColor("Aqua").setAuthor({
      name: `Commands for module Moderation:`,
      iconURL: client.user.avatarURL({ dynamic: true, size: 512 }),
    });
    modDesc = "";
    for (cmd in modCmds) {
      modDesc += `\`${modCmds[cmd]["name"]}\` - ${modCmds[cmd]["desc"]}\n`;
    }
    modPage.setDescription(modDesc);
    embeds.push(modPage);

    // Send pages..
    await embedPages(interaction, embeds);
  },
};
