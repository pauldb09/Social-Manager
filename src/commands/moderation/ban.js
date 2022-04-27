const BaseCommand = require("../../abstract/BaseCommand.js");

class Ban extends BaseCommand {
    constructor(client) {
        super({
            enabled: true,
            requiredPermissions: ["BAN_MEMBERS"],
            allowDM: false,
            cooldown: 5,
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

    async run({ ctx: e }) {
        const user = e.user;
        if (!user || !user.guild || user.guild && user.guild.id !== e.guild.id) return e.err(e.translate("USER_NOT_FOUND"));
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
        const memberPosition = member.roles.highest.position;
        const moderationPosition = e.member.roles.highest.position;
        if (!(moderationPosition > memberPosition)) return e.err(e.translate("USER_HIGHER_ROLE"));
        if (!member.bannable) return e.err(e.translate("BOT_CANT_BAN"));
        const reason = e.args[1] ? e.args[1].value.slice(0, 100) : e.translate("NO_REASON").replace("{user}", e.user.username);
        const days = e.args[2] ? parseInt(e.args[2].value) : 0;
        if (e.args[3]) {
            member.send({
                embeds: [{
                    author: { name: e.translate("BANNED_DM") + e.guild.name, icon_url: e.guild.iconURL({ format: "png", size: 512 }) },
                    description: reason,
                }]
            })
        }
        e.guild.bans.create(`${user.id}`, {
                reason: reason,
                days: days
            })
            .then(() => {
                e.success(e.translate("BANNED_SUCCESS").replace("{user}", user.tag).replace("{days}", days));
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