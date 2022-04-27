const BaseEvent = require("../abstract/BaseEvent.js");

class Ready extends BaseEvent {
    constructor(client) {
        super({
            name: "messageCreate",
            once: false,
        });
        this.client = client;
    }

    async run(message) {
        const serverData = await this.client.database.getServer(message.guildId)
        if (serverData.autopost === e.channel.id) {
            if (!e.crosspostable) {
                if (serverData.botChannel) {
                    const botChannel = message.guild.channels.cache.get(serverData.botChannel)
                    if (botChannel) {
                        botChannel.send({
                            embeds: [{
                                author: {
                                    name: `${e.guild.name}`,
                                    icon_url: e.guild.iconURL()
                                },
                                description: e.translate("AUTOPOST_ERROR"),
                                color: "#ff5858",
                                timestamp: new Date(),
                            }],

                        })
                    }
                }
            }
            e.crosspost()
                .then(() => {
                    if (serverData.botChannel) {
                        const botChannel = message.guild.channels.cache.get(serverData.botChannel)
                        if (botChannel) {
                            botChannel.send({
                                embeds: [{
                                    author: {
                                        name: `${e.guild.name}`,
                                        icon_url: e.guild.iconURL()
                                    },
                                    description: e.translate("AUTOPOST_SUCCESS"),
                                    color: "#ff5858",
                                    timestamp: new Date(),
                                }],

                            })
                        }
                    }
                })
                .catch(console.error);

        }
    }
}
module.exports = Ready;