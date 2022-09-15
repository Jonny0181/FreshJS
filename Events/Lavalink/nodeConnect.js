const client = require("../../index");

client.manager.on("nodeConnect", (node) => {
  console.log(`Node "${node.options.identifier}" connected.`);
});
