class BaseCommand {
    constructor(command) {
        super();
        this.name = command.name;
        this.description = command.description;
        this.arguments = command.arguments;
    }
    get permissions() {
        return null;
    }
}
module.exports = BaseCommand;