"use strict";
const { getFile } = require("../abstract/languages")
class Context {
    constructor(s, e, t, r) {
        (this.message = s), (this.client = e), (this.args = t), (this.guildDB = r);
    }
    get guild() {
        return this.message.guild;
    }
    get channel() {
        return this.message.channel;
    }
    get clientUser() {
        return this.message.client.user
    }
    get author() {
        return this.message.member.user;
    }
    get member() {
        return this.message.member;
    }
    translate(key, args, localeSet) {
        if (!args) args = [];
        const locale = (localeSet ? localeSet : this.guildDB.locale) || "EN";
        let file = getFile(locale);
        if (!file.keys[key]) {
            return console.error("[Translation] Unknow text Id " + key + " for locale " + locale + "")
        }
        const text = file.keys[key];
        args.forEach(arg => {
            const x = `{${arg.name}}`
            console.log(x)
            text.replace(x, arg.value)
            text
        })
        return text.replace("{prefix}", this.guildDB.prefix).replace("{prefix}", this.guildDB.prefix).replace("{prefix}", this.guildDB.prefix);
    }
    get user() {
        return this.message.options.length > 0 ? this.message.options.getMember("member") : null;
    }
    err(e) {
        return this.message.editReply({ embeds: [{ description: e, color: "#C73829" }] });
    }
    succes(e) {
        return this.message.editReply({ embeds: [{ description: e, color: "#3A871F" }] });
    }
}
module.exports = Context;