const { Event } = require('@aero/framework');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(interaction) {
		if (!interaction.isMessageComponent()) return;

        const exists = await this.client.router.run(interaction.customId, interaction);

        if (!exists) interaction.reply({ content: 'This interaction has expired.', ephemeral: true });
	}

};
