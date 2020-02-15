const KSoftImageCommand = require('../../../lib/structures/KSoftImageCommand');

module.exports = class extends KSoftImageCommand {

	constructor(...args) {
		super({ name: 'meme' }, ...args);
	}

};
