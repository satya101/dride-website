import { Injectable } from '@angular/core';

import { DocsMainComponent } from './pages/main/main.component';

import { PageItem } from './page-item';
import { SideNavComponent } from './layout/side-nav.component';

@Injectable()
export class PageService {

	public docMenu: any[]

	constructor(sideNav: SideNavComponent) {
		this.docMenu = sideNav.docMenu;
	}


	getPages() {

		const res = {};
		res['DocsMainComponent'] = (new PageItem(DocsMainComponent, {}))
		for (const page of this.docMenu) {
			res[page.url] = (new PageItem(page.component, {}))
		}

		return res;
	}
}
