const { readdirSync } = require("fs");
class EventHandler {
    constructor(e) {
        this.client = e;
        this.built = !1;
        this.build();
    }
    build() {
        if (this.built) return this;
        const e = readdirSync(this.client.location + "/src/events");
        for (let t of e) {
            const e = (t = new(require(`../events/${t}`))(this.client)).exec.bind(t);
            t.once ? this.client.once(t.name, t.exec.bind(t)) : this.client.on(t.name, e), 0;
        }
        return (this.built = !0), this;
    }
}
module.exports = EventHandler;