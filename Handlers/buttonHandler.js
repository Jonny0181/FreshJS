const { loadFiles } = require("../Functions/fileLoader");

async function loadButtons(client) {
  const Files = await loadFiles("Buttons");

  Files.forEach((file) => {
    const button = require(file);
    if (!button.id) return;

    client.buttons.set(button.id, button);
  });
}

module.exports = { loadButtons };
