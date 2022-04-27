const BaseCommand = require("../../abstract/BaseCommand.js");

class Ban extends BaseCommand {
    constructor(client) {
        super({
            enabled: true,
            requiredPermissions: ["MANAGE_GUILD"],
            allowDM: false,
            cooldown: 5,
            name: "auto-publish",
            required: { vote: false, premium: false, owner: false },
            description: "Sets the autopublish channel. All messages will be automatically published.",
            arguments: [
                { name: "channel", description: "The channel you want to set as auto-publish channel", required: true, type: 7 },
            ]
        });
        this.client = client;
    }

    async run(e) {
        if (e.options.getBoolean("reset")) {
            if (!e.guildDB.autopost) return e.err(e.translate("PLUGIN_NOT_ENABLED"));
            e.guildDB.autopost = null;
            this.client.database.handleCache(e.guildDB);
            return e.success(e.translate("PLUGIN_DISABLED"));
        }
        const channel = e.options.getChannel("channel");
        if (!channel || channel.guild.id !== e.guild.id) return e.err(e.translate("CHANNEL_NOT_FOUND"));
        if (!channel.permissionsFor(e.guild.me).has("VIEW_CHANNEL") || !channel.permissionsFor(e.guild.me).has("SEND_MESSAGES") || !channel.permissionsFor(e.guild.me).has("EMBED_LINKSS")) {
            return e.err(e.translate("CHANNEL_NO_PERMISSIONS"));
        }
        if (!["GUILD_NEWS"].includes(channel.type)) return e.err(e.translate("CHANNEL_NOT_TEXT"));
        if (e.guildDB.autopost && e.guildDB.autopost.channel && e.guildDB.autopost.channel === channel.id) {
            return e.err(e.translate("SAME_SETTINGS"));

        } else {
            e.guildDB.autopost = channel.id
            this.client.database.handleCache(e.guildDB);
            return e.success(e.translate("SET_AUTOPOST").replace("{channel}", channel.toString()));
        }
    }
}
module.exports = Ban;