const { prefix } = require('./config/aero');

module.exports = {
	defaultPrefix: prefix,
	regexPrefix: /^(hey +)?aero[,! ]/i,
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	logger: {
		level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
	},
	loadDefaultErrorListeners: true
};
