const BaseCommand = require("../../abstract/BaseCommand.js");

class Ban extends BaseCommand {
    constructor(client) {
        super({
            enabled: true,
            requiredPermissions: ["MANAGE_GUILD"],
            allowDM: false,
            cooldown: 5,
            name: "modlogs",
            required: { vote: false, premium: false, owner: false },
            description: "Sets the modlogs channel",
            arguments: [
                { name: "channel", description: "The channel you want to set as modlog channel", required: true, type: 7 },
                { name: "thread_for_case", description: "If you want to create a new thread for each case. Pretty usefull", required: true, type: 5 },
                { name: "reset", description: "Resets the modlog plugin", required: false, type: 5 },

            ]
        });
        this.client = client;
    }

    async run(e) {
        if (e.options.getBoolean("reset")) {
            if (!e.guildDB.modlogs) return e.err(e.translate("PLUGIN_NOT_ENABLED"));
            e.guildDB.modlogs = null;
            this.client.database.handleCache(e.guildDB);
            return e.success(e.translate("PLUGIN_DISABLED"));
        }
        const channel = e.options.getChannel("channel");
        if (!channel || channel.guild.id !== e.guild.id) return e.err(e.translate("CHANNEL_NOT_FOUND"));
        if (!channel.permissionsFor(e.guild.me).has("VIEW_CHANNEL") || !channel.permissionsFor(e.guild.me).has("SEND_MESSAGES") || !channel.permissionsFor(e.guild.me).has("EMBED_LINKSS")) {
            return e.err(e.translate("CHANNEL_NO_PERMISSIONS"));
        }
        if (!["GUILD_TEXT", "GUILD_NEWS"].includes(channel.type)) return e.err(e.translate("CHANNEL_NOT_TEXT"));
        const send_thread = e.options.getBoolean("thread_for_case");
        if (e.guildDB.modlogs && e.guildDB.modlogs.channel && e.guildDB.modlogs.channel === channel.id) {
            if (e.guildDB.modlogs.send_thread === send_thread) return e.err(e.translate("SAME_SETTINGS"));
            else {
                e.guildDB.modlogs.send_thread = send_thread;
                this.client.database.handleCache(e.guildDB);
                return e.success(e.translate(send_thread ? "SET_THREAD_MODLOGS" : "SET_NO_THREAD_MODLOGS"));
            }
        } else {
            e.guildDB.modlogs = {
                channel: channel.id,
                send_thread: send_thread
            }
            this.client.database.handleCache(e.guildDB);
            return e.success(e.translate("SET_MODLOGS").replace("{channel}", channel.toString()));
        }
    }
}
module.exports = Ban;