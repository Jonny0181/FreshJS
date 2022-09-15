const client = require("../../index");

client.manager.on("nodeError", (node, error) => {
  console.log(
    `Node "${node.options.identifier}" encountered an error: ${error.message}.`
  );
});
