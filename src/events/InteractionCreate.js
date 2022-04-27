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
        try {
            await interaction.deferReply();
            const serverData = await this.client.database.getServer(interaction.guildId)
            if (interaction.isCommand()) {
                if (interaction.channel.type === "DM") return interaction.editReply(`Slash commands can't be used inside dms!\n\n• Invite the bot to your server: https://social-manager.net/invite`);
                const command = this.client.commands.commands.get(interaction.commandName);
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
            } else if (interaction.isButton()) {
                const context = new Context(interaction, interaction.client, null, serverData);

                if (interaction.customId.startsWith("delete_case_")) {
                    const case_id = interaction.customId.split("_")[2];
                    const del = await this.client.database.removeCase(case_id, serverData, interaction.guild, interaction.member.user.tag);
                    if (del) {
                        context.success(context.translate("CASE_DELETED").replace(`{case}`, case_id));
                    } else if (del == "not found") {
                        context.err(context.translate("CASE_NOT_FOUND"));
                    } else {
                        context.err(context.translate("CASE_ERROR"));

                    }
                }


            }
        } catch {
            this.err("An unexpected error has occured while running your interaction! Please report this error in [Social Manager's server](https://social-manager.net/support)");

        }
    }
    err(e, interaction) {
        return interaction.editReply({ embeds: [{ description: `${interaction.guild.me.permissionsIn(interaction.channel).has("USE_EXTERNAL_EMOJIS") ?"<:social_error:968882669045813278> ":"❌ "}` + e, color: "#C73829" }] });
    }

}

module.exports = Ready;