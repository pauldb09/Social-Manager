const BaseEvent = require("../abstract/BaseEvent.js");
const Context = require("../modules/Context.js");

class Ready extends BaseEvent {
    constructor(client) {
        super({
            name: "interactionCreate",
            once: false,
        });
        this.client = client;
    }

    async run(interaction) {
        await interaction.deferReply();
        if (interaction.isCommand()) {
            if (interaction.channel.type === "DM") return interaction.editReply(`Slash commands can't be used inside dms!\n\n• Invite the bot to your server: https://social-manager.net/invite`);
            const command = this.client.commands.get(interaction.commandName);
            const serverData = await this.database.getServer(interaction.guildId)
            const context = new Context(interaction, interaction.client, interaction.options, serverData);
            command.run(context);
        }
    }
}
module.exports = Ready;