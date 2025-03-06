/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * License: MIT License
 *
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * Co-Authored-By: yhvr <yhvr@protonmail.com> (https://yhvr.me)
 * 
 * Credit-Example:
 * 2019 dirigeants (MIT License)
 * 2024 [mint](https://ravy.dev/mint), [yhvr](https://yhvr.me) @ [Aero](https://aero.bot)
 */

const { Task } = require('@aero/framework');

module.exports = class extends Task {

	async run({ channel, user, text, replyLink }) {
		if (!channel || !text || !user) return false;
		const _channel = await this.client.channels.fetch(channel);
		if (!_channel) {
      this.client.console.debug(`reminder queued for invalid channel: ${channel} (u=${user})`);
      return false;
    }
		return _channel.send(`<@${user}> You wanted me to remind you: ${text}${replyLink ? ` (in reply to ${replyLink})` : ""}`);
	}

};

