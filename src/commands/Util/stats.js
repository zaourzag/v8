const { Command, version: klasaVersion, Duration, util } = require('@aero/framework');
const { version: discordVersion, MessageEmbed } = require('discord.js');
const { hostname, totalmem, cpus } = require('os');
const { version: aeroVersion } = require('../../../package');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_STATS_DESCRIPTION')
		});
	}

	async run(msg) {
		const total = (totalmem() / 1024 / 1024 / 1024).toFixed(0);
		const usage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

		const { mobile } = msg.flagArgs;

		let output = [
			`\u001b[0;34m                                         ####              \u001b[0;0m`, 							``,
			`\u001b[0;34m                                   ###############         \u001b[0;0m`, 							`\u001b[1;31m${this.client.user.username.toLowerCase().replace(/\s+/g, '-')}-${this.client.shard.id} \u001b[0;0m@ \u001b[1;31m${hostname()}\u001b[0;0m`,
			`\u001b[0;34m                              ######################%%%#   \u001b[0;0m`, 							`\u200b`,
			`\u001b[0;34m                        #######################%%%         \u001b[0;0m`, 							`\u001b[0;31mAero\u001b[0;0m: ${aeroVersion} (${this.client.config.commitHash})`,
			`\u001b[0;34m              ##########################\u001b[0;30m///**              \u001b[0;0m`, 				`\u001b[0;31mNode\u001b[0;0m: ${process.version}`,
			`\u001b[0;34m ####################################%%\u001b[0;30m***                 \u001b[0;0m`, 				`\u001b[0;31mKlasa\u001b[0;0m: ${klasaVersion}`,
			`\u001b[0;30m           *////////*******\u001b[0;34m#####%%%%%%%%%                  \u001b[0;0m`, 				`\u001b[0;31mDiscord.js\u001b[0;0m: ${discordVersion}`,
			`\u001b[0;30m                          //*\u001b[0;34m%%%%%%%%%%%%%%                \u001b[0;0m`, 				``,
			`\u001b[0;30m                         /////\u001b[0;34m%%%%%%%%%%%%%%%              \u001b[0;0m`, 				`\u001b[0;31mCPU\u001b[0;0m: ${cpus().length}x ${cpus()[0].model.trim()} @ ${(cpus()[0].speed / 1000).toFixed(2)}GHz`,
			`\u001b[0;30m                        //////\u001b[0;34m#%%%%%%%%%%%%%%%%            \u001b[0;0m`, 				`\u001b[0;31mRAM\u001b[0;0m: ${total}GB (${(usage / (total * 1024) * 100).toFixed(2)}%)`,
			`\u001b[0;30m                      ///,    \u001b[0;34m%%%%%%\u001b[0;36m%%%%%%%%%%             \u001b[0;0m`, 	``,
			`\u001b[0;30m                    /         \u001b[0;34m%%\u001b[0;36m%%%%%%%%                   \u001b[0;0m`, 	`\u001b[0;31mUptime\u001b[0;0m: ${Duration.toNow(Date.now() - (process.uptime() * 1000))}`,
			`\u001b[0;36m                             %%%%%%                        \u001b[0;0m`, 							``,
			`\u001b[0;30m                           #\u001b[0;36m%%%                            \u001b[0;0m`, 				`\u001b[0;30m██\u001b[0;31m██\u001b[0;32m██\u001b[0;33m██\u001b[0;34m██\u001b[0;35m██\u001b[0;36m██\u001b[0;37m██\u001b[0;0m`,
			`\u001b[0;36m                          %%                               \u001b[0;0m`, 							`\u001b[0;40m  \u001b[0;41m  \u001b[0;42m  \u001b[0;43m  \u001b[0;44m  \u001b[0;45m  \u001b[0;46m  \u001b[0;47m  \u001b[0;0m`,
			`\u001b[0;30m                         ,                                 \u001b[0;0m`, 							``
		]

		if (mobile) {
			output = output.filter((_, idx) => idx % 2 === 1).filter(cur => cur.length > 0).slice(0, 9).map(item => item.replace(/\u001b\[\d+;\d+m/g, ''));	
		} else {
			output = output.reduce((acc, cur, idx) => {
				if (idx % 2 === 0) acc.push(cur);
				else acc[acc.length - 1] += cur;
				return acc;
			}, [])
		}

		msg.send(util.codeBlock('ansi', output.join('\n')));
	}

};
