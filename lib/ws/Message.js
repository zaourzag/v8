/*
 * Co-Authored-By: rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: mint <mint@aero.bot> (https://dsc.ng)
 * 
 * Credit-Example:
 * [rxsto](https://rxs.to), [mint](https://dsc.ng) @ [Aero](https://aero.bot)
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
