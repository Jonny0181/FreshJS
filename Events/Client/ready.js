const { loadCommands } = require("../../Handlers/commandHandler");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log("The client is ready!");

    loadCommands(client);

    const { connect } = require("mongoose");
    connect(client.config.database.uri, {}).then(() =>
      console.log("The client is now connected to the database.")
    );
  },
};
