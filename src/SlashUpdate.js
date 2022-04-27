const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');
const { token } = require('../config.js');
console.log('• Loading the commands to refresh');
const commands = [];
let x = -1;
for (const directory of readdirSync(`${__dirname}/commands`, { withFileTypes: true })) {
    if (!directory.isDirectory()) continue;
    for (const command of readdirSync(`${__dirname}/commands/${directory.name}`, { withFileTypes: true })) {
        if (!command.isFile()) continue;
        const Interaction = require(`${__dirname}/commands/${directory.name}/${command.name}`)
        console.log(Interaction)
        const getted = new Interaction({})
        console.log(getted)
        x++
        console.log(`Command ${x} is ${getted.name}`)
        console.log(getted.arguments)
        commands.push({ name: getted.name, description: getted.description, options: getted.arguments ? getted.arguments : [] });
    }
}
console.log(`• Loaded ${commands.length} slash commands to refresh`);
const rest = new REST({ version: '9' }).setToken(token);
(async() => {
    try {
        console.log(`• Refreshing client "946414667436269579" slash commands. Developer Mode? `);
        await rest.put(Routes.applicationCommands("968763404888211457"), { body: commands });
        console.log(`• Success! Refreshed client "946414667436269579" slash commands`);
    } catch (error) {
        console.error(error);
    }
})();