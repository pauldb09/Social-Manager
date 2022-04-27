const mongoose = require("mongoose"),
    guildData = require("../models/guildData"),
    config = require("../../config");
const uuidv4 = require("uuid/v4");

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

    async generateCase(data, ctx) {
        const case_id = uuidv4();
        if (ctx.guildDB.modlogs) {
            const channel = ctx.guild.channels.cache.get(ctx.guildDB.modlogs.channel);
            if (channel) channel.send({
                embeds: [{
                    author: {
                        name: `${data.target.tag} (${data.target.id})`,
                        icon_url: data.target.avatar
                    },
                    description: `${data.text}\n\n**<:unknown43:968885935204872202> ${ctx.translate("REASON")}:** ${data.reason}`,
                    color: "#ff5858",
                    footer: {
                        text: `${ctx.translate("CASE_ID")}: ${case_id}`
                    },
                    timestamp: new Date(),
                }],

            })
        }
        ctx.guildDB.cases.push({
            id: case_id,
            data: data,
        });
        this.handleCache(ctx.guildDB);
        return { id: case_id, data: data };
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