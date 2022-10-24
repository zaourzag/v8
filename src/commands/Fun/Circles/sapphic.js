const LGBTImageCommand = require('../../../../lib/structures/LGBTImageCommand');

module.exports = class extends LGBTImageCommand {


	constructor(...args) {
		super('sapphic', ...args, { aliases: ['sapphic'] });

		this.name = 'wlw';
	}

};
