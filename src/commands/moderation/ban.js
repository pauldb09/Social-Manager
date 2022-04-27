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
        const user = e.user
        if (!user) return e.errorMessage(e.translate("USER_NOT_FOUND"));
    }
}
module.exports = Help;