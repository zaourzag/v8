const { Listener } = require('@sapphire/framework');
const { ActivityType } = require('discord.js');
const { encode } = require('../lib/ws/util/MessageUtil');
const Message = require('../lib/ws/Message');
const { READY_CLIENT } = require('../lib/ws/util/constants').types;
const req = require('@aero/http');

function updateWsPing(ping) {
	const epochInSeconds = Math.floor(new Date() / 1000);
	const data = {
		timestamp: epochInSeconds,
		value: ping
	};

	req('https://api.statuspage.io/v1/pages')
		.path(process.env.STATUS_ID)
		.path('/metrics')
		.path(process.env.STATUS_METRIC_WSPING)
		.path('data.json')
		.post()
		.header('Authorization', `OAuth ${process.env.STATUS_TOKEN}`)
		.body({ data }, 'json')
		.send();
}

class ReadyListener extends Listener {

	constructor(context, options) {
		super(context, {
			...options,
			once: false,
			event: 'ready'
		});
	}

	async run() {
		const client = this.container.client;

		client.user.setActivity(`${client.options.defaultPrefix}help`, { type: ActivityType.Listening });
		
		if (process.env.AETHER_URL) {
			client.logger.info('[Aether] Sending ready event.');
			client.manager.ws.send(encode(new Message(READY_CLIENT, { id: client.manager.id })));
		}
		
		if (client.config.stage === 'staging') {
			client.logger.info(`[Status] Posting stats with initial ping of ${client.ws.ping}ms.`);
			client.setInterval(() => updateWsPing(client.ws.ping), 60 * 1000);
		}
		
		client.experiments = await req('https://rollouts.advaith.workers.dev/')
			.json()
			.then(res => res
				.filter(item => item?.data?.type === 'guild' && item?.data?.title && item?.data?.description && item?.data?.buckets)
				.map(({ data, rollout }) => {
					const experiment = {};

					experiment.name === data.title;

					experiment.buckets = new Map();
					for (const bucket of data.buckets)
						experiment.buckets.set(bucket, data.description[bucket]);


					experiment.hash = data.hash;
					experiment.id = data.id;

					experiment.overrides = new Map();
					const [rolloutHash, _, __, rolloutRanges, overrides] = rollout; /* eslint-disable-line no-unused-vars */
					for (const override of overrides) {
						const { b: bucket, k: ids } = override;
						if (experiment.overrides.has(bucket)) {
							const entry = experiment.overrides.get(bucket);
							for (const id of ids) entry.add(id);
						} else experiment.overrides.set(bucket, new Set(ids));
					}
					return experiment;
				})
				.reduce((acc, cur) => acc.set(cur.id, cur), new Map())
			)
			.catch(() => ({}));

		client.config.install_params /* eslint-disable-line camelcase */
			= await client.application.fetch().then(app => app.installParams)
			?? { scopes: ['applications.commands', 'bot'], permissions: '8' };

		client.logger.info(`[Aggregator] Cluster ${client.shard.id} sending ready.`);
		client.logger.info(`[Aggregator] Shards ${client.shard.shards.join(', ')} ready.`);
		client.aggregator.ready();
	}

}

module.exports = ReadyListener;
