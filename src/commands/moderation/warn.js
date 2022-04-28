const BaseCommand = require("../../abstract/BaseCommand.js");

class Ban extends BaseCommand {
    constructor(client) {
        super({
            enabled: true,
            requiredPermissions: ["BAN_MEMBERS"],
            allowDM: false,
            cooldown: 5,
            name: "warn",
            required: { vote: false, premium: false, owner: false },
            description: "Warn an user in private messages",
            arguments: [
                { name: "user", description: "The user you want to kick from the server", required: true, type: 6 },
                { name: "reason", description: "The reason why you want to kick this user", required: false, type: 3 },
                { name: "automod", description: "Automatically bans the user if he has too much warnings", required: false, type: 5 },
            ]
        });
        this.client = client;
    }

    async run(e) {
        const user = e.user;
        if (!user) return e.err(e.translate("USER_NOT_FOUND"));
        if (user.id === e.clientUser.id || user.id === e.author.id || user.id === e.guild.ownerId) return e.err(e.translate("USER_NOT_WARNABLE"));
        const member = await e.guild.members.fetch(user.id).catch((err) => {
            this.client.error({
                error: err,
                location: {
                    data: this,
                    type: "COMMAND"
                }
            })
            return e.err(e.translate("USER_NOT_FOUND"));
        });
        if (!member) return e.err(e.translate("USER_NOT_FOUND"));
        if (!member.guild || member.guild && member.guild.id !== e.guild.id) return e.err(e.translate("USER_NOT_FOUND"));
        const memberPosition = member.roles.highest.position;
        const moderationPosition = e.member.roles.highest.position;
        if (!(moderationPosition > memberPosition)) return e.err(e.translate("USER_HIGHER_ROLE"));
        const reason = e.options.getString("reason") ? e.options.getString("reason") : e.translate("NO_REASON").replace("{user}", e.author.username);
        if (e.options.getBoolean("automod")) {
            await member.send({
                embeds: [{
                    author: { name: e.translate("KICKED_DM") + e.guild.name, icon_url: e.guild.iconURL({ format: "png", size: 512 }) },
                    description: e.translate("KICKED_DM_BODY").replace("{mod}", e.author.username).replace("{reason}", reason),
                    color: "#ff5858",

                }]
            })
        }

        this.client.database.generateCase({
            target: {
                tag: member.user.tag,
                id: user.id,
                avatar: member.user.displayAvatarURL({ format: "png", size: 512 }),
            },
            mod: {
                tag: e.author.tag,
                id: e.author.id,
                avatar: e.author.displayAvatarURL({ format: "png", size: 512 }),
            },
            type: "WARN",
            reason: reason,
            text: e.translate("KICK_CASE_TEXT").replace("{user}", member.user.tag).replace("{mod}", e.author.tag),
        }, e)
        e.success(e.translate("KICKED_SUCCESS").replace("{user}", member.user.tag).replace("{days}", days));
    }
}
module.exports = Ban;