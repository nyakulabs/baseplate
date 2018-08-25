module.exports = {
    async exec(data) {
        const client = data.client;
        const message = data.message;
        const args = data.args;
        const config = data.config;

        // make sure amount specified is valid
        if (!parseInt(args[1])) return message.channel.send(`Specify an amount of messages to purge (limit ${config.prefs.maxPurgeMessages})`);
        let amount = parseInt(args[1]);
        if (amount > config.prefs.maxPurgeMessages) return message.channel.send(`Cannot purge ${amount} messages, maximum is ${config.prefs.maxPurgeMessages}`);

        // purge and notify user of purge
        message.channel.fetchMessages({ limit: (amount+1) }) // fetch the user's message as well
        .then(messages => {
            message.channel.bulkDelete(messages);
        });
        message.channel.send(`Successfully deleted ${amount} messages.`)
        .then(message => {
            message.delete(3000); // delete message after 3000ms (3 seconds), feel free to change
        });
    }
};
