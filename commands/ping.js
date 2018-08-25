module.exports = {
    async exec(data) {
        const client = data.client;
        const message = data.message;

        message.channel.send(`<@${message.author.id}>, thou hast been pong'd! :ping_pong:\n**${client.ping}ms**`);
    }
};
