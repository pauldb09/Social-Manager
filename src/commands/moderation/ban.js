const BaseCommand = require("../../abstract/BaseCommand.js");

class Ban extends BaseCommand {
    constructor(client) {
        super({
            enabled: true,
            requiredPermissions: ["BAN_MEMBERS"],
            allowDM: false,
            cooldown: 5,
            name: "ban",
            required: { vote: false, premium: false, owner: false },
            description: "Bans a user from the server",
            arguments: [
                { name: "user", description: "The user you want to ban from the server", required: true, type: 6 },
                { name: "reason", description: "The reason why you want to ban this user", required: false, type: 3 },
                { name: "days", description: "Number of days of messages to delete, must be between 0 and 7, inclusive", required: false, type: 4 },
                { name: "send_dm", description: "If you want to notice this user in DM", required: false, type: 5 },
            ]
        });
        this.client = client;
    }

    async run(e) {
        const user = e.user;
        if (!user) return e.err(e.translate("USER_NOT_FOUND"));
        if (user.id === e.clientUser.id || user.id === e.author.id || user.id === e.guild.ownerId) return e.err(e.translate("USER_NOT_BANABLE"));
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
        if (!member.bannable) return e.err(e.translate("BOT_CANT_BAN"));
        const reason = e.options.getString("reason") ? e.options.getString("reason") : e.translate("NO_REASON").replace("{user}", e.author.username);
        const days = e.options.getInteger("days") ? e.options.getInteger("days") : 0;
        if (e.options.getBoolean("send_dm")){
            await member.send({
                embeds: [{
                    author: { name: e.translate("BANNED_DM") + e.guild.name, icon_url: e.guild.iconURL({ format: "png", size: 512 }) },
                    description: e.translate("BANNED_DM_BODY").replace("{mod}", e.author.username).replace("{reason}", reason),
                    color: "#ff5858",

                }]
            })
        }

        e.guild.bans.create(`${user.id}`, {
                reason: reason,
                days: days
            })
            .then(() => {
                this.client.database.generateCase({
                    target: {
                        tag: member.user.tag,
                        id: user.id,
                        avatar: member.user.displayAvatarURL({ format: "png", size: 512 }),
                    },
                    type: "BAN",
                    mod: {
                        tag: e.author.tag,
                        id: e.author.id,
                        avatar: e.author.displayAvatarURL({ format: "png", size: 512 }),
                    },
                    reason: reason,
                    text: e.translate("BAN_CASE_TEXT").replace("{user}", member.user.tag).replace("{mod}", e.author.tag),
                }, e)
                e.success(e.translate("BANNED_SUCCESS").replace("{user}", member.user.tag).replace("{days}", days));
            })
            .catch(err => {
                this.client.error({
                    error: err,
                    location: {
                        data: this,
                        type: "COMMAND"
                    }
                })
                return e.err(e.translate("USER_NOT_FOUND"));
            });
    }
}
module.exports = Ban;