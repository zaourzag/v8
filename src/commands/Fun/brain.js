const MemeGenerationCommand = require('../../../lib/structures/MemeGenerationCommand');

module.exports = class extends MemeGenerationCommand {

	constructor(...args) {
		const textValidator = text => text.split(',').length === 4;
		const textValidatorResponse = 'Please enter the text of the 4 panels seperated by commas.';
		super({
			name: 'brain',
			text: true,
			textValidator,
			textValidatorResponse
		}, ...args);
	}

};
