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
            const command = this.client.commands.commands.get(interaction.commandName);
            const serverData = await this.client.database.getServer(interaction.guildId)
            const context = new Context(interaction, interaction.client, interaction.options.data, serverData);
            if (command.required && command.required.owner && context.author.id !== context.guild.ownerId) return context.err("You need to be the Server Owner to use this command for security reasons!");
            if (command.botPerms) {
                for (const perm of command.botPerms) {
                    if (!interaction.channel.permissionsFor(interaction.guild.me).has(perm)) return context.err(`I need the \`${perm}\` Discord Permission to run this command!\nCheckout the [discord guide](https://support.discord.com/hc/en-us/articles/206029707-Setting-Up-Permissions-FAQ) to learn how to set up permissions.`);
                }
            }
            if (command.requiredPermissions) {
                for (const perm of command.requiredPermission) {
                    if (perm === "MANAGE_MESSAGES") {

                    }
                    if (!interaction.channel.permissionsFor(interaction.guild.me).has(perm)) return context.err(`You need to have the \`${perm}\` Discord Permission to run this command!\nPlease ask an admin to give you the permission if you want to use this command.`);
                }
            }
            command.run(context);
        }
    }
}
module.exports = Ready;