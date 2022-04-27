const { readdirSync } = require("fs"), { Collection } = require("@discordjs/collection");
class CommandHandler {
    constructor(n) {
        this.client = n;
        this.commands = new Collection();
        this.build();
    }
    build() {
        const n = readdirSync(`${this.client.location}/src/commands`, { withFileTypes: !0 });
        for (const i of n) {
            if (!i.isDirectory()) continue;
            const n = readdirSync(`${this.client.location}/src/commands/${i.name}`, { withFileTypes: !0 });
            for (const o of n) {
                if (!o.isFile()) continue;
                const n = new(require(`${this.client.location}/src/commands/${i.name}/${o.name}`))(this.client);
                this.commands.set(n.name, n);
            }
        }
        return this.commands;
    }
}
module.exports = CommandHandler;