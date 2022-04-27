const { Client, Intents } = require("discord.js");
const { GUILDS, GUILD_VOICE_STATES, GUILD_MESSAGES } = Intents.FLAGS;
const Cluster = require("discord-hybrid-sharding")
const Database = require("./modules/MongoDB");
const CommandService = require("./modules/CommandHandler");
const ClientError = require("./modules/ClientError");
const EventHandler = require("./modules/EventHandler");

class BaseClient extends Client {
    constructor(options) {
        super({
            disableMentions: "everyone",
            restRequestTimeout: 4e4,
            restTimeOffset: 600,
            shards: Cluster.data.SHARD_LIST,
            shardCount: Cluster.data.TOTAL_SHARDS,
            intents: [GUILDS, GUILD_VOICE_STATES, GUILD_MESSAGES]
        });

        this.location = process.cwd();
        this.database = new Database(this);
        this.commands = new CommandService(this);
        this.events = new EventHandler(this);

    }

    /**
     * @description Starts the client.
     * @param {object} options
     * @returns {BaseClient}
     */
    async start(options) {
        if (!options) throw new Error("No options provided.");
        this.login(options.token);

    }
}
module.exports = BaseClient;