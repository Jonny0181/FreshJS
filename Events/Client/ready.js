const { Client, ActivityType } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler");
const { loadButtons } = require("../../Handlers/buttonHandler");
const ConsoleLogger = require("../../Handlers/consoleLogger");
const logger = new ConsoleLogger();

module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    logger.info("The client is ready!");

    loadCommands(client);
    loadButtons(client);

    const { connect } = require("mongoose");
    connect(client.config.database.uri, {
      dbName: "alpha",
    }).then(
      () => client.manager.init(client.user.id),
      logger.info("The client is now connected to the database.")
    );
    client.user.setStatus("dnd");
    await randomStatus(client);
  },
};

/**
 *
 * @param {Client} client
 */
async function randomStatus(client) {
  let counter = 0;

  const updateStatus = () => {
    const statusOptions = [
      {
        name: `${client.guilds.cache.size} guilds..`,
        type: ActivityType.Watching,
      },
      {
        name: `music in ${client.manager.players.size} guild(s)..`,
        type: ActivityType.Listening,
      },
      {
        name: "/help | /play",
        type: ActivityType.Listening,
      },
    ];
    client.user.setActivity(statusOptions[counter]);

    if (++counter >= statusOptions.length) counter = 0;

    setTimeout(updateStatus, 1000 * 60 * 5);
  };
  updateStatus();
}
