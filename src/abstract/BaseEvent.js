const EventEmitter = require("events");
class BaseEvent extends EventEmitter {
    constructor(event) {
        super();
        this.name = event.name;
        this.once = event.once;
    }
    exec(...e) {
        this.run(...e).catch((e) => this.emit("error", e));
    }
}
module.exports = BaseEvent;