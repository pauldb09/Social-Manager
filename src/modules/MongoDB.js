const mongoose = require("mongoose"),
    guildData = require("../models/guildData"),
    config = require("../../config"),
    { v4: uuidv4 } = require('uuid');
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
                console.error("MongoDB:`, `Error\n", err);
                this.state = 1;
                return null
            })
            .then(() => {
                this.state = 2;
                console.log("MongoDB:`, `Connected");
                return mongoose
            });
    }

    async removeCase(data, guildDB, ctx) {
        const found = guildDB.cases.find(c => c.id === data);
        let succes = true;
        if (!found) return "not found"
        if (found.data.type === "BAN") {
            ctx.guild.bans.remove(found.data.target.id, ctx.translate("CASE_REMOVED").replace("{user}", ctx.author.tag)).catch(err => {
                console.error(err)
                succes = false
            })
        }
        guildDB.cases = guildDB.cases.filter(c => c.id !== data);
        this.handleCache(guildDB);
        return succes;
    }

    async generateCase(data, ctx) {
        const case_id = uuidv4()
        if (ctx.guildDB.modlogs) {
            const channel = ctx.guild.channels.cache.get(ctx.guildDB.modlogs.channel);
            if (channel) {
                if (ctx.guildDB.modlogs.send_thread === true) {
                    channel.threads
                        .create({
                            name: `Case #${ctx.guildDB.cases.length+1}`,
                            autoArchiveDuration: 10080,
                            reason: ctx.translate("CREATE_THREAD_REASON"),
                        })
                        .then(threadChannel => threadChannel.send({
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
                            components: [{
                                type: 'ACTION_ROW',
                                components: [{ type: "BUTTON", customId: "delete_case_" + case_id + "", style: 4, label: ctx.translate("REMOVE_CASE") }]
                            }]

                        }, ))
                        .catch(console.error);
                } else {

                    channel.send({
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
                        components: [{
                            type: "ACTION_ROW",
                            components: [{ customId: "delete_case_" + case_id + "", style: 4, label: ctx.translate("REMOVE_CASE") }]
                        }]

                    })
                }

            }
        }
        ctx.guildDB.cases.push({
            id: case_id,
            data: data,
        });
        this.handleCache(ctx.guildDB);
        return { id: case_id, data: data };
    }

    async handleCache(newData) {
        this.knowGuilds[newData.serverId] = newData
        newData.save();
        return newData;
    }

    async getServer(serverId, cache) {
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