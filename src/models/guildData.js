const mongoose = require("mongoose"),
    model = new mongoose.Schema({
        serverId: { type: String, required: true },
        modlogs: { type: Object, required: false },
        cases: { type: Array, required: false, default: [] },
    });
module.exports = mongoose.model("guildData", model);