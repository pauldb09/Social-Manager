const BaseCommand = require("../../abstract/BaseCommand.js");

class Ban extends BaseCommand {
    constructor(client) {
        super({
            enabled: true,
            requiredPermissions: ["MANAGE_CHANNELS"],
            botPerms: ["MANAGE_CHANNELS"],
            allowDM: false,
            cooldown: 5,
            name: "nuke",
            required: { vote: false, premium: false, owner: false },
            description: "Clears all messages from a channel",
            arguments: [
                { name: "channel", description: "The channel you want to nuke", required: false, type: 7 },
            ]
        });
        this.client = client;
    }

    async run(e) {
        const channel = e.options.getChannel("channel") || e.channel;
        if (!channel || channel.guild.id !== e.guild.id) return e.err(e.translate("CHANNEL_NOT_FOUND"));
        if (!channel.permissionsFor(e.guild.me).has("VIEW_CHANNEL") || !channel.permissionsFor(e.guild.me).has("SEND_MESSAGES") || !channel.permissionsFor(e.guild.me).has("EMBED_LINKSS")) {
            return e.err(e.translate("CHANNEL_NO_PERMISSIONS"));
        }
        if (!["GUILD_TEXT", "GUILD_NEWS"].includes(channel.type)) return e.err(e.translate("CHANNEL_NOT_TEXT"));
        const position = channel.position;
        const topic = channel.topic;
        channel.delete()

        setTimeout(async() => {
            const channel2 = await channel.clone();
            channel2.setPosition(position);
            channel2.setTopic(topic);
            channel2.send({
                embeds: [{
                    author: {
                        name: `${e.guild.name}`,
                        icon_url: e.guild.iconURL()
                    },
                    description: e.translate("CHANNEL_NUKED"),
                    color: "#ff5858",
                    footer: {
                        text: `${e.translate("NUKED_BY").replace("{user}", e.author.tag)}`
                    },
                    timestamp: new Date(),
                }],

            })
        }, 1000);

    }
}
module.exports = Ban;