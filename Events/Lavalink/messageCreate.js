const { Message } = require("discord.js");
const Client = require("../../index");
const freshChannel = require("../../Schemas/freshChannel");

module.exports = {
  name: "messageCreate",
  once: false,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const { channel, author } = message;
    const data = await freshChannel.model.findOne({ _id: message.guild.id });

    if (!data) return;
    if (author.bot) return;

    const channelID = data.channelID;
    const messageID = data.messageID;
    const toggle = data.toggle;

    if (toggle === true) {
      if (channel.id == channelID) {
        message.delete();

        const Fmessage = channel.messages.fetch({
          around: messageID,
          limit: 1,
        });

        switch (message.content) {
          case "np" || "now": {
            return channel
              .send({
                content: "Soon:tm:",
              })
              .then((msg) => {
                setTimeout(() => msg.delete(), 10000);
              })
              .catch((err) => console.log(err));
          }
        }
      }
    }
  },
};
