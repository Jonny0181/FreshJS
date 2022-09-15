const { loadCommands } = require("../../Handlers/commandHandler");
const { loadButtons } = require("../../Handlers/buttonHandler");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log("The client is ready!");

    loadCommands(client);
    loadButtons(client);

    const { connect } = require("mongoose");
    connect(client.config.database.uri, {
      dbName: "alpha",
    }).then(
      () => client.manager.init(client.user.id),
      console.log("The client is now connected to the database.")
    );
  },
};
