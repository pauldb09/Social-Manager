const mongoose = require("mongoose"),
    guildData = require("../models/guildData"),
    config = require("../../config"),
    fetch = require("node-fetch");
class MongoDB {
    constructor(e) {
        this.client = e;
    }
    async connect() {
        return (
            mongoose.connect(config.mongo.url, config.mongo.options).catch((e) => {
                console.error("MongoDB:`, `Error\n", e);
            }),
            mongoose
        );
    }
    async getServer(e) {
        let o = await guildData.findOne({ serverID: e });
        return o || (o = await new guildData({ serverID: e, prefix: "*", lang: "en", color: "#3A871F" }).save()), o;
    }
    async checkPremium(e) {
        const o = config.premium.url + "premiumguild?token=" + config.premium.token + "&guildid=" + e,
            n = await fetch(o).catch((e) => console.error(e));
        return await n.json();
    }
}
module.exports = MongoDB;