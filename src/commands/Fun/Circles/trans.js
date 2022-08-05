const LGBTImageCommand = require('../../../../lib/structures/LGBTImageCommand');

module.exports = class extends LGBTImageCommand {


	constructor(...args) {
		super('trans', ...args, { aliases: ['transgender'] });

		this.name = 'trans';
	}

};
