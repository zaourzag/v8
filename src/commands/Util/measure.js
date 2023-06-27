const { Command } = require('@aero/framework');
const req = require('@aero/http');
const { MessageEmbed } = require('discord.js');
const BASE_URL = 'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed';
const { infinity, success, error, minus } = require('../../../lib/util/constants').emojis;

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_MEASURE_DESCRIPTION'),
			usage: '<url:url>',
			aliases: ['lhr'],
			permissionLevel: 7
		});
	}

	async run(msg, [url]) {
		const loading = await msg.channel.send(`${infinity} this might take a few seconds`);

		const res = await req(BASE_URL)
			.query({
				strategy: 'desktop',
				url,
				key: process.env.GOOGLE_TOKEN
			})
			.query('category', 'performance')
			.query('category', 'accessibility')
			.query('category', 'best-practices')
			.query('category', 'seo')
			.get()
			.json();

		const { lighthouseResult } = res;

		if (lighthouseResult) {
			const scores = [];
			const metrics = [];

			for (const categoryKey in lighthouseResult.categories) {
				const category = lighthouseResult.categories[categoryKey];
				scores.push([category.title, category.score]);
			}

			for (const auditKey in lighthouseResult.audits) {
				if (![
					'first-contentful-paint',
					'interactive',
					'speed-index',
					'total-blocking-time',
					'largest-contentful-paint',
					'cumulative-layout-shift'
				].includes(auditKey)) continue;
				const audit = lighthouseResult.audits[auditKey];
				metrics.push([audit.title, audit.score, audit.displayValue])
			}

			const embed = new MessageEmbed()
				.setTitle(`Performance audit for ${url}`)
				.addField('Scores', scores.map(([title, score]) => `${scoreToEmoji(score)} ${title}: ${Math.round(score * 100)}`).join('\n'))
				.addField('Metrics', metrics.map(([title, score, displayValue]) => `${scoreToEmoji(score)} ${title}: ${displayValue}`).join('\n'));

			await msg.sendEmbed(embed);
		} else
			await msg.responder.error('ERROR_SHORT', errors);


		return loading.delete();
	}

};

function scoreToEmoji(score) {
	if (score >= 0.9) return success;
	if (score >= 0.5) return minus;
	return error;
}
