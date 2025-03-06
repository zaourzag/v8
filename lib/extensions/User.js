/*
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * 
 * Credit-Example:
 * [mint](https://ravy.dev/mint), [Stitch07](https://github.com/Stitch07) @ [Aero](https://aero.bot)
 */

const { Structures } = require('discord.js');

Structures.extend('User', User => {
  class AeroUser extends User {

    get tag() {
      return this.discriminator === '0'
        ? this.username
        : super.tag
    }

    get name() {
      return this.tag;
    }

  }

  return AeroUser;
});
