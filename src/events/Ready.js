const BaseEvent = require("../abstract/BaseEvent.js");
class Ready extends BaseEvent {
    constructor(client) {
        super({
            name: "ready",
            once: true,
        });
        this.client = client;
    }

    async run() {

        this.client.user.setActivity({ name: "/help - social-manager.net", type: "WATCHING" });
        setInterval(() => {
            this.client.user.setActivity("/help - social-manager.net", { type: "WATCHING" });
        }, 1e3 * 60 * 30);
    }
}
module.exports = Ready;