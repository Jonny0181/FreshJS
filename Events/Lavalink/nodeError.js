const client = require("../../index");
const ConsoleLogger = require("../../Handlers/consoleLogger");
const logger = new ConsoleLogger();

client.manager.on("nodeError", (node, error) => {
  logger.error(
    `Node "${node.options.identifier}" encountered an error: ${error.message}.`
  );
});
