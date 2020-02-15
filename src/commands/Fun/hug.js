const NekosLifeCommand = require('../../../lib/structures/NekosLifeCommand');

module.exports = class extends NekosLifeCommand {

	constructor(...args) {
		super('hug', ...args);
	}

};
