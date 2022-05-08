const { Command } = require('@aero/framework');
const req = require('@aero/http');

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_DEFINE_DESCRIPTION'),
			usage: '<term:string>',
			aliases: ['def'],
			permissionLevel: 0
		});
	}

	async run(msg, [term]) {
		const entries = await req(BASE_URL).path(term).json();

		if (!entries.length) throw 'COMMAND_DEFINE_NOTFOUND';

		let out = [];

		let i = 1;

		for (const entry of entries) {
			const { word, phonetic, meanings } = entry;

			if (i === 1) out.push(phonetic ? `**${word}** (${phonetic})\n` : `**${word}**\n`);

			for (const meaning of meanings) {
				const { partOfSpeech, definitions, synonyms, antonyms } = meaning;

				out.push(`${i++}. *${partOfSpeech}*`);

				for (const definitionEntry of definitions) {
					const { definition, example } = definitionEntry;

					out.push(`\u200b\t- ${definition}`)
					if (example) out.push(`\u200b\t  *"${example}"*`);
				}

				if (synonyms?.length) out.push(`\u200b\t __synonyms:__ ${synonyms.join(', ')}`)
				if (antonyms?.length) out.push(`\u200b\t __antonyms:__ ${antonyms.join(', ')}`)
			}
		}

		msg.send(out.join('\n'));
	}

};
