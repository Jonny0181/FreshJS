const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription("Allows you to set your afk status!")
}