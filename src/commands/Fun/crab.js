const MemeGenerationCommand = require('../../../lib/structures/MemeGenerationCommand');

module.exports = class extends MemeGenerationCommand {

	constructor(...args) {
		const textValidator = text => text.split(',').length === 2;
		const textValidatorResponse = 'Please enter the text of a top and a bottom panel seperated by a comma.';
		super({
			name: 'crab',
			text: true,
			textValidator,
			textValidatorResponse,
			fileType: 'mp4',
			cooldown: 30
		}, ...args);
	}

};
