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
        if (message.author.bot) return

        const serverData = await this.client.database.getServer(message.guildId)
        if (serverData.autopost && serverData.autopost === message.channel.id) {
            if (!message.crosspostable) {
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
            message.crosspost()
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