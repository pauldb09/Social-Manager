const EventEmitter = require("events");
class CommandHandler extends EventEmitter {
    constructor(e) {
        super(), (this.client = e);
    }
    async handler(e) {

    }
}
module.exports = CommandHandler;