const BaseCommand = require("../../abstract/BaseCommand.js");

class Ban extends BaseCommand {
    constructor(client) {
        super({
            enabled: true,
            requiredPermissions: ["MANAGE_GUILD"],
            allowDM: false,
            cooldown: 5,
            name: "botlogs",
            required: { vote: false, premium: false, owner: false },
            description: "Sets the channel used by the bot to send errors/notifications",
            arguments: [
                { name: "channel", description: "The channel you want to set as botlog channel", required: true, type: 7 },
            ]
        });
        this.client = client;
    }

    async run(e) {
        if (e.options.getBoolean("reset")) {
            if (!e.guildDB.botlogs) return e.err(e.translate("PLUGIN_NOT_ENABLED"));
            e.guildDB.botlogs = null;
            this.client.database.handleCache(e.guildDB);
            return e.success(e.translate("PLUGIN_DISABLED"));
        }
        const channel = e.options.getChannel("channel");
        if (!channel || channel.guild.id !== e.guild.id) return e.err(e.translate("CHANNEL_NOT_FOUND"));
        if (!channel.permissionsFor(e.guild.me).has("VIEW_CHANNEL") || !channel.permissionsFor(e.guild.me).has("SEND_MESSAGES") || !channel.permissionsFor(e.guild.me).has("EMBED_LINKSS")) {
            return e.err(e.translate("CHANNEL_NO_PERMISSIONS"));
        }
        if (!["GUILD_NEWS","GUILD_TEXT"].includes(channel.type)) return e.err(e.translate("CHANNEL_NOT_TEXT"));
        if (e.guildDB.botlogs && e.guildDB.botlogs.channel && e.guildDB.botlogs.channel === channel.id) {
            return e.err(e.translate("SAME_SETTINGS"));

        } else {
            e.guildDB.botlogs = channel.id
            this.client.database.handleCache(e.guildDB);
            return e.success(e.translate("SET_BOTLOGS").replace("{channel}", channel.toString()));
        }
    }
}
module.exports = Ban;