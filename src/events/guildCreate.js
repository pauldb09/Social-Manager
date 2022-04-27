const KongouEvent = require("../abstract/BaseEvent.js");
class GuildCreate extends KongouEvent {
    get name() {
        return "guildCreate";
    }
    get once() {
        return !1;
    }
    async run(e) {
        if (0 == e.channels.cache.length) return;
        const n = e.systemChannel ? e.systemChannel : e.channels.cache.find((n) => "GUILD_TEXT" === n.type && n.permissionsFor(e.me).has("SEND_MESSAGES"));
        n &&
            n.send({
                embeds: [{
                    color: "#3A871F",
                    author: { name: "Thanks for adding Social Manager!", icon_url: "https://cdn.discordapp.com/avatars/783708073390112830/f4aabacb3667ba1831d3ca5f7b2e486d.webp?size=512", url: "https://green-bot.app" },
                    description: "Hello! You can setup me by using the following commands:\n\n**Set the modlogs channel:**: `/setmodlogs`",
                }, ],
            });
    }
}
module.exports = GuildCreate;