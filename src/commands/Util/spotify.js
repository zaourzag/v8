const { Command } = require('@aero/framework');
const req = require('@aero/http');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_SPOTIFY_DESCRIPTION'),
			usage: '<query:string>',
			aliases: ['song', 's'],
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg, [query]) {
        const geniusRes = await req('https://api.genius.com/')
            .path('search')
            .auth(process.env.GENIUS_TOKEN)
            .query('q', query)
            .json();

        let lyrics = 'No lyrics found.';
        if (geniusRes.meta.status === 200) {
            lyrics = geniusRes.response.hits.filter(hit => hit.type === 'song')[0].result.url;
        }

        const spotifyRes = await req('https://api.spotify.com/v1/')
            .path('search')
            .auth(this.spotifyCreds.access_token, this.spotifyCreds.token_type)
            .query('q', query)
            .query('type', 'track')
            .json()

        let song = 'No song found.';
        if (spotifyRes?.tracks?.total > 0) {
            song = spotifyRes.tracks.items[0].external_urls.spotify;
        }

        return msg.send(`${song}\n<${lyrics}>`);
	}

    async init() {
        if (!process.env.GENIUS_TOKEN || !process.env.SPOTIFY_USER) this.disable();

        const auth = Buffer.from(`${process.env.SPOTIFY_USER}:${process.env.SPOTIFY_SECRET}`).toString('base64');

        const { access_token, token_type, expires_in } = await req('https://accounts.spotify.com/')
            .path('/api/token')
            .auth(auth, 'Basic')
            .body({ grant_type: 'client_credentials' }, 'form')
            .post()
            .json()

        this.client.setTimeout(() => this.init(), expires_in * 1000);

        this.spotifyCreds = { access_token, token_type };

    }

};
