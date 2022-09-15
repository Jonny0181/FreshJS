const { Schema, SchemaTypes, model } = require("mongoose");

const reqString = {
  type: SchemaTypes.String,
  required: true,
};

const schema = new Schema(
  {
    _id: reqString,
    channelID: reqString,
    messageID: reqString,
    toggle: {
      type: SchemaTypes.Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
    autoIndex: false,
  }
);

const Model = model("fresh_channel", schema);

module.exports = {
  model: model("fresh_channel", schema),
  add: async (guild, channel, message, toggle) => {
    if (!guild) {
      throw new Error("Guild is undefined.");
    }
    await new Model({
      _id: guild.id,
      channelID: channel.id,
      messageID: message.id,
      toggle: toggle,
    }).save();
  },
};
