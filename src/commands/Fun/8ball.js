/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: kyranet (https://github.com/kyranet)
 * License: MIT License
 * 
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * 
 * Credit-Example:
 * 2019 dirigeants, kyranet (MIT License)
 * 2024 [mint](https://ravy.dev/mint) @ [Aero](https://aero.bot)
 */

const { Command } = require('@aero/framework');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['8', 'magic', '8ball', 'mirror'],
			bucket: 2,
			cooldown: 5,
			description: language => language.get('COMMAND_8BALL_DESCRIPTION'),
			usage: '<query:str>'
		});

		this
			.customizeResponse('query', msg => msg.language.get('COMMAND_8BALL_PROMPT'));
	}

	async run(msg, [question]) {
		const answers = msg.language.get('COMMAND_8BALL_ANSWERS');
		return msg.send(question.endsWith('?')
			? `${msg.author} | 🎱 ${answers[Math.floor(Math.random() * answers.length)]}`
			: msg.language.get('COMMAND_8BALL_NOQUESTION'));
	}

};
