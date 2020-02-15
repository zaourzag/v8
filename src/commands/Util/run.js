const { Command } = require('klasa');
const req = require('@aero/centra');
const { infinity, success } = require('../../../lib/util/constants').emojis;

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_RUN_DESCRIPTION'),
			usage: '<code:str>'
		});

		this.deprecated = 'This command is currently in development.';
	}

	async run(msg, [content]) {
		const regex = new RegExp('```(?<language>[a-z]*)\\n(?<code>[\\s\\S]*?)\\n```');
		if (!regex.test(content)) return msg.responder.error('Invalid codeblock');
		const message = await msg.send(`${infinity} executing code`);
		const { code, language } = regex.exec(content).groups;
		const res = await req(this.client.config.evalURL, 'POST')
			.path('eval')
			.body({ code, language })
			.send();
		return message.edit(`${success} eval successful\n\`\`\`${language}\n${res.json.result}\n\`\`\``);
	}

};
