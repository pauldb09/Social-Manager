const { token } = require("./config.js"), { Manager } = require("discord-hybrid-sharding");
const manager = new Manager("./src/index.js", { mode: "process", token: token });
["multipleResolves", "uncaughtException", "uncaughtExceptionMonitor", "unhandledRejection"].forEach((event) => {
    process.on(event, (e) => {
        console.log(e);
    });
});
manager.spawn({ timeout: -1 });