const client = require("./BaseClient");
const { token } = require("../config.js");
let client_1 = new client();

["multipleResolves", "uncaughtException", "uncaughtExceptionMonitor", "unhandledRejection"].forEach((e) => {
    process.on(e, (e) => {
        console.log(e);
    });
});

client_1.login(token);