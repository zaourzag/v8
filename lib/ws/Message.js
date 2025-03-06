/*
 * Co-Authored-By: rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * 
 * Credit-Example:
 * [rxsto](https://rxs.to), [mint](https://ravy.dev/mint) @ [Aero](https://aero.bot)
 */

class Message {

	constructor(type, data) {
		this.type = type;
		this.data = data;
	}

	toJSON() {
		return {
			t: this.type, /* eslint-disable-line id-length */
			d: this.data /* eslint-disable-line id-length */
		};
	}

}

module.exports = Message;
