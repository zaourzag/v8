const { Finalizer } = require('@aero/framework');

const { Message } = require('discord.js');

module.exports = class extends Finalizer {

	constructor(...args) {
		super(...args, {
			name: 'deleteFlag',
			enabled: true
		});
	}

	async run(msg, _, res) {
		let { delete: timeout } = msg.flagArgs;
		if (!timeout) return res;
		timeout = parseInt(timeout);
		if (!isNaN(timeout) && timeout < 20 && timeout > 0) timeout *= 1000;
		else timeout = 3000;

		setTimeout(() => msg.delete().catch(() => null), timeout);
		if (res instanceof Message) setTimeout(() => res.delete().catch(() => null), timeout);

		return res;
	}

};
