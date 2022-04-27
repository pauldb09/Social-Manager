const { token } = require("./config.js"), { Manager } = require("discord-hybrid-sharding");
const manager = new Manager("./src/cluster.js", { mode: "process", token: token });
manager.spawn({ timeout: -1 });