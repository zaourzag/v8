const { Monitor } = require('@aero/framework');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: false,
			ignoreOthers: false
		});

		this.circumventionPatternNameRegex = /^([A-Z][a-z]+)+[0-9]+$/;
		this.circumventionPatternMessageRegex = /^hi$/i;
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.heuristics') || msg.exempt) return;

		if (this.matchesCircumventionPattern(msg))
			msg.member.ban({ reason: msg.language.get('MONITOR_HEURISTICS'), days: 1 });
	}

	matchesCircumventionPattern(msg) {
		return msg.content
			&& !msg.member.prevMessageContent
			&& this.circumventionPatternNameRegex.test(msg.author.username)
			&& this.circumventionPatternMessageRegex.test(msg.content);
	}

};
