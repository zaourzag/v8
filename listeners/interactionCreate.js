const { Listener } = require('@sapphire/framework');

class InteractionCreateListener extends Listener {

	constructor(context, options) {
		super(context, {
			...options,
			event: 'interactionCreate'
		});
	}

	async run(interaction) {
		// Only handle message components (buttons, select menus)
		// Slash commands are handled by Sapphire's built-in system
		if (!interaction.isMessageComponent()) return;

		const exists = await this.container.client.router.run(interaction.customId, interaction);

		if (!exists) {
			interaction.reply({
				content: 'This interaction has expired.',
				ephemeral: true
			}).catch(() => {});
		}
	}

}

module.exports = InteractionCreateListener;
