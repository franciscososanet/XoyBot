const fs = require("fs");

module.exports = (client, discord) => {
  console.log("---------------------- COMANDOS ----------------------");
  fs.readdirSync("./prefixCommands/").forEach((dir) => {
    const commands = fs
      .readdirSync(`./prefixCommands/${dir}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commands) {
      const cmd = require(`../prefixCommands/${dir}/${file}`);
      if (cmd.name) {
        console.log(cmd.name);
        client.commands.set(cmd.name, cmd);
      } else {
        console.log(`Error: ${file}`);
      }
    }
  });
  console.log("---------------------- COMANDOS ----------------------");
};