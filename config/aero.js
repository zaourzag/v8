const { version } = require('../package');
const stage = process.env.AERO_ENV;
const [commitHash, ...commitMessage] = require('child_process').execSync('git log -1 --date-order --format=format:"%h - %s"').toString().split(' - ');

module.exports = {
	prefix: {
		production: 'a.',
		staging: 's.',
		development: 'd.',
		testing: 't.'
	}[stage],
	ipcSocket: {
		production: 9991,
		staging: 9992,
		testing: 9993,
		development: 9999
	}[stage],
	stage,
	stageShorthand: {
		production: 'prod',
		staging: 'beta',
		testing: 'test',
		development: 'dev'
	}[stage],
	commitHash,
	commitMessage: commitMessage.join(' - '),
	version,
	supportServer: 'https://discord.gg/7yfaYjeN6B',
	inviteURL: 'https://get.aero.bot',
	repoURL: 'https://ravy.dev/aero/v8',
	hasteURL: 'https://haste.aero.bot',
	colorgenURL: 'https://color.aero.bot',
	dailyPoints: 50,
	ownerAccess: ['234390727113703424'],
	instances: ['432129282710700033', '612228762330726411', '962349105122787358'],
	roleBulkThreshold: 3,
	ngrokPrefix: 'aero',
	ngrokRegion: 'eu',
	accessPort: {
		production: 32201,
		staging: 32202,
		development: 32203,
		testing: 32204
	}[stage]
};

module.exports.metricsEnabled = !['true', true].includes(process.env.METRICS_DISABLED);
