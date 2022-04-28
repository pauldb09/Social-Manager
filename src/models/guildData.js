const mongoose = require("mongoose"),
    model = new mongoose.Schema({
        serverId: { type: String, required: true },
        modlogs: { type: Object, required: false },
        autopost: { type: String, required: false },
        modlogs: { type: String, required: false },
        locale: { type: String, required: false,default:"en" },
        cases: { type: Array, required: false, default: [] },
    });
module.exports = mongoose.model("guildData", model);