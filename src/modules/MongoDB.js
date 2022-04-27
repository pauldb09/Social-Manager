const mongoose = require("mongoose"),
    guildData = require("../models/guildData"),
    config = require("../../config");

class MongoDB {
    constructor(client) {
        this.client = client;
        this.state = 0;
        this.connect();
    }
    async connect() {
        this.sate = 1;
        mongoose.connect(config.mongo.url, config.mongo.options)
            .catch((err) => {
                console.error("MongoDB:`, `Error\n", e);
                this.state = 1;
                return null
            })
            .then(() => {
                this.state = 2;
                console.log("MongoDB:`, `Connected");
                return mongoose
            });
    }

    async getServer(serverId) {
        if (this.state !== 2) return console.error("[MongoDB] Error: MongoDB is not connected.");
        let o = await guildData.findOne({ serverId: serverId });
        return o || (o = await new guildData({ serverId: serverId }).save()), o;
    }
}
module.exports = MongoDB;