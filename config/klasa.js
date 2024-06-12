const { prefix, stage, owners } = require('./aero');
const db = {
	production: 'aero',
	staging: 'aero-staging',
	development: 'aero-dev',
	testing: 'aero-test'
}[stage];

const { MONGO_URI: uri } = process.env;

module.exports = {
	commandEditing: true,
	commandLogging: true,
	console: { useColor: true },
	consoleEvents: {
		debug: stage === 'development',
		verbose: stage === 'development'
	},
	createPiecesFolders: false,
	disabledCorePieces: ['providers', 'languages', 'commands'],
	owners,
	prefix,
	providers: {
		default: 'mongodb',
		mongodb: {
			connectionString: uri,
			db,
			options: {
				forceServerObjectId: true
			}
		}
	},
	typing: false,
	readyMessage: 'Ready.'
};
