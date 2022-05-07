const { Event } = require('@aero/framework');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(message) {
		message.guild.raidReset();
		message.delete();
	}

};
