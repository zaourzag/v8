const { emojis, reactions } = require('./util/constants');

class Responder {

	constructor(message) {
		this.message = message;
	}

	success(text, newMessage = false) {
		if (!text) return this.message.react(reactions.success);
		return newMessage
			? this.message.channel.send(`${emojis.success} ${text}`)
			: this.message.send(`${emojis.success} ${text}`);
	}

	error(text, newMessage = false) {
		if (!text) return this.message.react(reactions.error);
		return newMessage
			? this.message.channel.send(`${emojis.error} ${text}`)
			: this.message.send(`${emojis.error} ${text}`);
	}

	lock() { this.message.react(reactions.lock); }

	unlock() { this.message.react(reactions.unlock); }

}

module.exports = Responder;
