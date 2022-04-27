const BaseEvent = require("../abstract/BaseEvent.js");
class Ready extends BaseEvent {
    constructor(client) {
        super({
            name: "interactionCreate",
            once: false,
        });
        this.client = client;
    }

    async run() {

    }
}
module.exports = Ready;