const { Command } = require('@aero/framework');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_ROLL_DESCRIPTION'),
			usage: '[how_many_dice:integer{1,1000}] [how_many_sides:integer]',
			usageDelim: ' '
		});
	}

	run(msg, [amount = 1, sides = 6]) {
		if (amount > 100 && sides > 100) throw "This won't fit into one message";
		if (amount > 10) return this.aboveTen(msg, amount, sides);
		return this.belowTen(msg, amount, sides);
	}

	aboveTen(msg, amount, sides) {
		const generated = {};
		let sum = 0;
		for (let i = 0; i < amount; i++) {
			const num = Math.floor(Math.random() * sides + 1);
			sum += num;
			generated[num]
				? generated[num]++
				: generated[num] = 1;
		}

		const out = Object.entries(generated)
			.sort((a, b) => a[0] - b[0])
			.map(([num, amt]) => `**${num}**: ${amt} time${amt === 1 ? '' : 's'}`)
			.join('\n');


		return msg.send(`Rolled:\n${out}\n\nTotal: ${sum}, Average: ${(sum / amount).toFixed(2)}`);
	}

	belowTen(msg, amount, sides) {
		const generated = [];
		for (let i = 0; i < amount; i++) generated.push(Math.floor(Math.random() * sides + 1));

		return msg.send(`Rolled: ${generated.join(', ')}`);
	}

};
