import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable()
export class MetaService {

	constructor(private metaService: Meta, private titleService: Title) { }


	set(title, description, type = 'website') {
		this.titleService.setTitle(title)
		this.addTag({property: 'twitter:title', content: title})
		this.addTag({property: 'og:title', content: title})
		this.addTag({property: 'og:image', content: 'https://firebasestorage.googleapis.com/v0/b/dride-2384f.appspot.com/o/assets%2Ficon.png?alt=media&token=b0ed9c54-6fc5-407c-907e-4c97f3206d5a'})
		this.addTag({name: 'description', content: description})
		this.addTag({property: 'twitter:description', content: description})
		this.addTag({property: 'og:description', content: description})
		this.addTag({property: 'og:type', content: type})
	}

	addTag(tagObj) {
		this.metaService.updateTag(tagObj)
	}

}
