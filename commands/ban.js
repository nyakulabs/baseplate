module.exports = {
    async exec(data) {
        const client = data.client;
        const message = data.message;
        const config = data.config;

        // make sure the user is allowed to kick other users, along with the bot itself
        if (!message.member.permissionsIn(message.channel).has("BAN_MEMBERS")) return message.channel.send('You don\'t have the required permissions to ban users.');

        const user = message.mentions.members.first();

        if (!message.mentions.members.first()) {
            message.channel.send('You must specify a user to ban.')
        } else {
            try {
                let tag = message.mentions.users.first().tag;
                await message.mentions.members.first().ban(`Banned by ${message.author.tag}`);
            } catch(err) {
                if (err) {
                    message.channel.send(`Unable to ban user from guild.`);
                    return;
                }
            }
            message.channel.send(`Successfully ban user from guild.`);
        }
    }
};
