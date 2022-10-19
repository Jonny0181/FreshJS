const client = require("../../index");
const ConsoleLogger = require("../../Handlers/consoleLogger");
const logger = new ConsoleLogger();

client.manager.on("nodeConnect", (node) => {
  logger.success(`Node "${node.options.identifier}" connected.`);
});
