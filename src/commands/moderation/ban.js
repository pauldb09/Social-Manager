const KongouCommand = require("../../abstract/KongouCommand.js");
class Help extends KongouCommand {
    get name() {
        return "ban";
    }
    get category() {
        return "Moderation0";
    }
    get aliases() {
        return ["h", "commands", "command"];
    }
    get description() {
        return "Bans someone from the server.";
    }
    get arguments() {
        return [{ name: "user", description: "The user you want to ban from the server", required: true }];
    }
    run({ ctx: e }) {
        const user = e.user
        if (!user) return e.errorMessage(e.translate("USER_NOT_FOUND"));
    }
}
module.exports = Help;