const KongouCommand = require("../../abstract/KongouCommand.js");
class Help extends KongouCommand {
    get name() {
        return "help";
    }
    get category() {
        return "Everyone Commands";
    }
    get aliases() {
        return ["h", "commands", "command"];
    }
    get description() {
        return "Displays all the commands of the bot. If you provide the name of a commands, it will return all available information about this command.";
    }
    get arguments() {
        return [{ name: "user", description: "The user you want to ban from the server", required: true }];
    }
    run({ ctx: e }) {
        if (!e.args[0]) {
            let sent = false;
            e.member.send({
                embeds: [{
                    author: {
                        name: e.clientUser.username,
                        icon_url: e.clientUser.displayAvatarURL({ format: "png", size: 512 }),
                    },
                    description: e.translate("HELP_MAIN"),
                }],
                components: [{
                    components: [
                        { label: e.translate("SUPPORT_SERVER"), url: "https://social-manager.net/support", style: 5, type: "BUTTON" },
                        { label: e.translate("USER_GUIDE"), url: "https://guide.social-manager.net/", style: 5, type: "BUTTON" }
                    ],
                    type: 'ACTION_ROW'
                }]
            }).catch(() => {
                sent = false
            })
            if (sent) e.err(e.translate("HELP_SENT_DM"))
            else e.err(e.translate("HELP_SENT_DM_FAILED"))
        } else {

        }
    }
}
module.exports = Help;