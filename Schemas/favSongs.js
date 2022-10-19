const { Schema, SchemaTypes, model } = require("mongoose");

const favSchema = new Schema(
  {
    _id: {
      type: SchemaTypes.String,
      required: true,
    },
    songs: [],
  },
  {
    versionKey: false,
    autoIndex: false,
  }
);

const Model = model("fav_songs", favSchema);

module.exports = {
  model: model("fav_songs", favSchema),
  add: async (user, song) => {
    if (!user) {
      throw Error("User is not defined.");
    }
    await new Model({
      _id: user.id,
      _songs: [song],
    }).save();
  },
};
