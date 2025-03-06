/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * License: MIT License
 * 
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * 
 * Credit-Example:
 * 2019 dirigeants (MIT License)
 * 2024 [mint](https://ravy.dev/mint) @ [Aero](https://aero.bot)
 */

const { Argument } = require('@aero/framework');

module.exports = class extends Argument {

	async run(arg, possible, message) {
		const channel = this.constructor.regex.channel.test(arg) ? await this.client.channels.fetch(this.constructor.regex.channel.exec(arg)[1]).catch(() => null) : null;
		if (channel && (channel.type === 'GUILD_NEWS')) return channel;
		throw message.language.get('RESOLVER_INVALID_NEWSCHANNEL', possible.name);
	}

};
