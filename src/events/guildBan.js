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

    async run(ban_old) {
        setTimeout(async() => {
        const serv_data = await this.client.database.getServer(ban_old.guild.id);
        if (serv_data && serv_data.modlogs) {
            const ban = await ban_old.fetch()
            const channel = ban.guild.channels.cache.get(serv_data.modlogs.channel);
            if (serv_data.cases && serv_data.cases.find(e => e.data.reason === ban.reason && e.data.target.id === ban.user.id)) return;
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
    
    }, 3000);
    }
}
module.exports = Ready;