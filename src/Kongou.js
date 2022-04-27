const { Client, Intents } = require("discord.js"), { GUILDS, GUILD_VOICE_STATES, GUILD_MESSAGES } = Intents.FLAGS,
    dbl = require("dblapi.js"),
    EventHandler = require("./modules/EventHandler.js"),
    CommandHandler = require("./modules/CommandHandler.js"),
    MongoDB = require("./modules/MongoDB"),
    Message = require("./modules/Message");
class Kongou extends Client {
    constructor(e) {
        super({ disableMentions: "everyone", restRequestTimeout: 4e4, restTimeOffset: 600, shards: Cluster.data.SHARD_LIST, shardCount: Cluster.data.TOTAL_SHARDS, intents: [GUILDS, GUILD_VOICE_STATES, GUILD_MESSAGES] }),

            (this.location = process.cwd()),
            (this.dbl = new dbl("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4MzcwODA3MzM5MDExMjgzMCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjQ0NTE2ODA5fQ.QXQBGqZQ3MW5S-fhZxoDKKFNT5b_pzN96wQ_UDsGLaE", this)),
            (this.mongoDB = new MongoDB(this)),
            (this.commmands = new CommandHandler(this).build()),
            new EventHandler(this).build(),
            this.mongoDB.connect(),
            (this.cluster = new Cluster.Client(this)),
            (this.cmds = new Message(this)),
            this.on("messageCreate", (e) => {
                this.cmds.handle(e);
            })
    }
}
module.exports = Kongou;