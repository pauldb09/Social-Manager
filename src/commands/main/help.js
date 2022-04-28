const BaseCommand = require("../../abstract/BaseCommand.js");
class Help extends BaseCommand {
    constructor(client) {
        super({
            name: "help",
            category: "main",
            description: "Displays all the commands of the bot. ",
            arguments: [
                { name: "command", description: "The command you want to have informations", required: false, type: 3 }
            ],
        });

        this.client = client;
    }

    run(e) {
        if (!e.args[0]) {
            let sent = true;
            e.member.send({
                embeds: [{
                    author: {
                        name: e.clientUser.username,
                        icon_url: e.clientUser.displayAvatarURL({ format: "png", size: 512 }),
                    },
                    description: e.translate("HELP_MAIN"),
                    color: "#ff5858",
fields:[{
    name:"Command List",
    value:this.client.commands.commands.map(cmd=>`\`${cmd.name}\``).join(", ")
}]
                }],
                components: [{
                    components: [
                        { label: e.translate("SUPPORT_SERVER"), url: "https://social-manager.net/support", style: 5, type: "BUTTON" },
                        { label: e.translate("USER_GUIDE"), url: "https://guide.social-manager.net/", style: 5, type: "BUTTON" }
                    ],
                    type: 'ACTION_ROW'
                }]
            }).catch((err) => {
                console.log(err)
                sent = null
            })
            .then(()=>{
                if (sent) e.success(e.translate("HELP_SENT_DM"))
                else e.err(e.translate("HELP_SENT_DM_FAILED"))
            })
      
        } else {

        }
    }
}
module.exports = Help;