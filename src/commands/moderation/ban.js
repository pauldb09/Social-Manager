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
            ]
        });
        this.client = client;
    }

    run({ ctx: e }) {
        const user = e.user
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
    }
}
module.exports = Ban;