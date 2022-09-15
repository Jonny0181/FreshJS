const { Schema, SchemaTypes, model } = require("mongoose");
const { String, Boolean } = SchemaTypes;

const freshChannelConfigSchema = new Schema({
  guildID: {
    type: String,
    require: true,
    unique: true,
  },
  channelID: {
    type: String,
    require: true,
    unique: true,
  },
  messageID: {
    type: String,
    require: true,
    unique: true,
  },
  toggle: {
    type: Boolean,
    require: true,
    unique: true,
  },
});

module.exports = model("freshChannelConfig", freshChannelConfigSchema);
