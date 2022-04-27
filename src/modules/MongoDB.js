const mongoose = require("mongoose"),
    guildData = require("../models/guildData"),
    config = require("../../config");

class MongoDB {
    constructor(client) {
        this.client = client;
        this.state = 0;
        this.knowGuilds = [];
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

    async handleCache(newData) {
        if (!this.knowGuilds.includes(newData.serverId)) return newData.save();
        delete this.knowGuilds[serverId];
        newData.save();
        this.knowGuilds[serverId] = newData
        return newData;
    }

    async getServer(serverId) {
        if (this.state !== 2) return console.error("[MongoDB] Error: MongoDB is not connected.");
        if (this.knowGuilds.includes(serverId)) return this.knowGuilds[serverId];
        let o = await guildData.findOne({ serverId: serverId });
        if (o) {
            this.knowGuilds[serverId] = o;
            setTimeout(() => {
                delete this.knowGuilds[serverId];
            }, 1000 * 60 * 60);
        }
        return o || (o = await new guildData({ serverId: serverId }).save()), o;
    }
}
module.exports = MongoDB;