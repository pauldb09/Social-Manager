const mongoose = require("mongoose"),
    model = new mongoose.Schema({
        serverId: { type: String, required: true },
        modlogs: { type: String, required: true },
    });
module.exports = mongoose.model("guildData", model);