const AeroCommand = require('../../lib/structures/AeroCommand');
const { ApplicationCommandOptionType } = require('discord.js');

class EchoCommand extends AeroCommand {

	constructor(context, options) {
		super(context, {
			...options,
			name: 'echo',
			description: 'Echoes your message',
			aliases: ['say', 'repeat'],
			category: 'Utility'
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'message',
					description: 'The message to echo',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			]
		});
	}

	async run(message, args) {
		const content = await args.rest('string').catch(() => null);
		
		if (!content) {
			return message.reply('Please provide a message to echo!');
		}

		return message.reply({
			content,
			allowedMentions: { parse: [] }
		});
	}

	async runSlash(interaction) {
		const content = interaction.options.getString('message', true);
		
		return interaction.reply({
			content,
			allowedMentions: { parse: [] }
		});
	}

}

module.exports = EchoCommand;
