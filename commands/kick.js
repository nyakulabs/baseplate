module.exports = {
    async exec(data) {
        const client = data.client;
        const message = data.message;
        const config = data.config;

        // make sure the user is allowed to kick other users, along with the bot itself
        if (!message.member.permissionsIn(message.channel).has("KICK_MEMBERS")) return message.channel.send('You don\'t have the required permissions to kick users.');

        const user = message.mentions.members.first();

        if (!message.mentions.members.first()) {
            message.channel.send('Specify a user to kick.')
        } else {
            try {
                let tag = message.mentions.users.first().tag;
                await message.mentions.members.first().kick(`Kicked by ${message.author.tag}`);
            } catch(err) {
                if (err) {
                    message.channel.send(`Unable to kick user.`);
                    return;
                }
            }
            message.channel.send(`Successfully kicked user.`);
        }
    }
};
