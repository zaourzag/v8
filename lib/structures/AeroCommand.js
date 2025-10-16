const { Command } = require('@sapphire/framework');

class AeroCommand extends Command {

	constructor(context, options = {}) {
		super(context, {
			...options,
			generateDashLessAliases: true
		});

		this.defaultPermissions = options.defaultPermissions || null;
	}

	// Message command handler
	async messageRun(message, args) {
		// Check permissions for message commands
		if (message.guild) {
			const canUse = await this.client.permissions.canUse(message, this);
			if (!canUse) {
				return message.reply({ content: 'You do not have permission to use this command.' });
			}
		}

		return this.run(message, args);
	}

	// Slash command handler
	async chatInputRun(interaction) {
		// Check permissions for slash commands
		if (interaction.guild) {
			// Create a mock message object for permission checking
			const mockMessage = {
				author: interaction.user,
				member: interaction.member,
				guild: interaction.guild
			};

			const canUse = await this.client.permissions.canUse(mockMessage, this);
			if (!canUse) {
				return interaction.reply({
					content: 'You do not have permission to use this command.',
					ephemeral: true
				});
			}
		}

		return this.runSlash(interaction);
	}

	// Override this in subclasses for message commands
	async run(message, args) {
		throw new Error(`${this.constructor.name} doesn't have a run method.`);
	}

	// Override this in subclasses for slash commands
	async runSlash(interaction) {
		throw new Error(`${this.constructor.name} doesn't have a runSlash method.`);
	}

}

module.exports = AeroCommand;
