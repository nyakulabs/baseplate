/*--------------------------------*\
|   baseplate discord bot          |
|   written using discord.js       |
|   created by nyaku labs, 2018    |
\*--------------------------------*/

// load config
const config = require('./config.json');
if (!config.bot.prefix || !config.tokens.discord) {
		console.log('\n\n\nHey! If this is your first time using baseplate, make sure to set everything up in \'config.json\'.\n\n\n')
		process.kill(0);
}
// init discord.js and other modules
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const snekfetch = require('snekfetch');
const didyoumean = require('didyoumean2');
// construct commands array using an anonymous func
console.log('Loading commands...');
const commands = (() => {
		let files = [];
		let folder = fs.readdirSync('./commands');
		for (let filename of folder) {
				if (filename.endsWith('.js')) { // this section uses regex to remove '.js'
						files.push({name: filename.replace(/\.[^/.]+$/, ''), file: require(`./commands/${filename}`)});
				}
		}
		return files;
})();
// construct array from commands array for use with didyoumean
console.log('Loading didyoumean...');
const dym = (() => {
		let files = [];
		let folder = fs.readdirSync('./commands');
		for (let filename of folder) {
				if (filename.endsWith('.js')) {
						files.push(filename.replace(/\.[^/.]+$/, ''));
				}
		}
		return files;
})();
// do stuff when message received
client.on('message', async (message) => {
		// if message is invalid, throw it out
		if (!message.content.toLowerCase().startsWith(config.bot.prefix) || message.author.bot) return;
		if (!config.prefs.enableDirectMessages && message.channel.type == 'dm') return;
		// process message
		const args = message.content.slice(config.bot.prefix.length).split(/ +/);
		const cmd = args.shift().toLowerCase();
		// determine if message is command
		let command = commands.find(x => x.name === cmd);
		if (!command) {
				let dymcheck = didyoumean(cmd, dym);
				if (dymcheck && config.prefs.enableDidYouMean) {
						message.channel.send(`Did you mean **${config.bot.prefix}${dymcheck}**?`);
				}
				return;
		}
		// pass other data on to command; feel free to change this as needed
		let data = {
				client: client,
				message: message,
				args: message.content.slice(config.bot.prefix.length).split(/ +/),
        config: config,
        longarg: message.cleanContent.slice(config.bot.prefix.length + command.name.length + 1)
		};
		// run command
		command.file.exec(data);
		console.log(`Command ${command.name} executed // (MID: ${message.id})`);
})
// stuff to do when the bot is ready
client.on('ready', () => {
		console.log('Ready');
		client.user.setActivity(`${config.bot.prefix}help`) // set this to whatever you prefer the bot to be playing
})
// log in
console.log('Logging in...');
client.login(config.tokens.discord);
