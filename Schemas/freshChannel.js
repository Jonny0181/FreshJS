const { Schema, SchemaTypes, model } = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    guildID: reqString,
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

module.exports = model("freshChannel", schema, "fresh_channel");
