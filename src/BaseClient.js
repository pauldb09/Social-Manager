const { Client, Intents } = require("discord.js");
const { GUILDS, GUILD_VOICE_STATES, GUILD_MESSAGES } = Intents.FLAGS;
const Cluster = require("discord-hybrid-sharding")

class BaseClient extends Client {
    constructor(options) {
        super({
                disableMentions: "everyone",
                restRequestTimeout: 4e4,
                restTimeOffset: 600,
                shards: Cluster.data.SHARD_LIST,
                shardCount: Cluster.data.TOTAL_SHARDS,
                intents: [GUILDS, GUILD_VOICE_STATES, GUILD_MESSAGES]
            }),

            this.location = process.cwd()

    }
}
module.exports = BaseClient;