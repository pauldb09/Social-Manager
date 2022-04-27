const BaseEvent = require("../abstract/BaseEvent.js");
const Context = require("../modules/Context.js");

class Ready extends BaseEvent {
    constructor(client) {
        super({
            name: "guildBanAdd",
            once: false,
        });
        this.client = client;
    }

    async run(ban) {
        const serv_data = await this.client.database.getServer(ban.guild.id);
        if (serv_data && serv_data.modlogs) {
            const channel = ban.guild.channels.cache.get(serv_data.modlogs.channel);
            if (channel) channel.send({
                embeds: [{
                    author: {
                        name: `${ban.user.tag} (${ban.user.id})`,
                        icon_url: ban.user.avatarURL()
                    },
                    description: `**${ban.user.tag}** has been banned from the server.\n\n**<:unknown43:968885935204872202> Reason:** ${ban.reason ? ban.reason : "No reason given"}`,
                    color: "#ff5858",
                    timestamp: new Date(),
                }],

            })
        }
    }
}
module.exports = Ready;