var admin = require('firebase-admin');

meta = {
	/*
   * Subscribe user to a topic
   */
	setMeta: function(html, videoId) {
		return new Promise((resolve, reject) => {
			try {
				var db = admin.firestore();

				let htmlDOM = html.toString();
				let root = '';
				db.collection('clips')
					.doc(videoId)
					.get()
					.then(snapshot => {
						var thumb = data['thumbs'] ? thumb : '';
						const data = snapshot.data();
						root += meta.meta({
							property: 'og:title',
							content: data['description'] ? data['description'] : 'Event on Dride Cloud'
						});
						root += meta.meta({
							property: 'og:description',
							content: data['plates'] ? data['plates'] : "This video doesn't have a description yet."
						});
						root += meta.meta({ property: 'og:image:width', content: '320' });
						root += meta.meta({ property: 'og:image:height', content: '176' });
						if (data['thumbs']) {
							root += meta.meta({ property: 'og:image', content: thumb });
						}
						root += meta.meta({ property: 'og:video', content: data['clips']['src'] });
						root += meta.meta({
							property: 'og:video:secure_url',
							content: data['clips']['src']
						});
						root += meta.meta({ property: 'og:type', content: 'video.other' });
						root += meta.meta({ property: 'twitter:card', content: 'player' });
						root += meta.meta({ property: 'twitter:site', content: '@drideHQ' });
						root += meta.meta({
							property: 'twitter:url',
							content: 'https://dride.io/clip/' + videoId
						});
						root += meta.meta({ property: 'twitter:title', content: data['description'] });
						root += meta.meta({ property: 'twitter:description', content: data['plates'] });
						root += meta.meta({
							property: 'twitter:image:src',
							content: thumb
						});
						root += meta.meta({ property: 'twitter:player', content: data['clips']['src'] });
						root += meta.meta({ property: 'twitter:player:width', content: '1280' });
						root += meta.meta({ property: 'twitter:player:height', content: '720' });
						root += meta.meta({
							property: 'twitter:player:stream',
							content: data['clips']['src']
						});
						root += meta.meta({
							property: 'twitter:player:stream:content_type',
							content: 'video/mp4'
						});

						resolve(htmlDOM.replace('<head>', '<head>' + root));
					});
			} catch (e) {
				reject(e);
			}
		});
	},
	meta(tag) {
		return '<meta property="' + tag.property + '" content="' + tag.content + '">';
	}
};

module.exports = meta;
