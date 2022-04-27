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
        let sent = false;
        e.member.send({
            embeds: []
        });
        e.reply(e.translate("HELP_SENT_DM"))
    }
}
module.exports = Help;