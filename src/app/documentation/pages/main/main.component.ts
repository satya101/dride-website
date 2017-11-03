import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { SideNavComponent } from '../../layout/side-nav.component';
import { MetaService } from '../../../helpers/meta/meta.service'


@Component({
	selector: 'docs-main',
	templateUrl: './main.component.html'
})
export class DocsMainComponent implements OnInit {

	public docMenu: any[]

	constructor(sideNav: SideNavComponent, private meta: MetaService) {
		this.docMenu = sideNav.docMenu;

	}
	ngOnInit() {
		this.meta.set(
			'Documentation',
			'How to build a dashcam with a RaspberryPi and how to build Dride apps'
		)
	}
}

@Pipe({
	name: 'showOnHomePage'
})
export class ShowOnHomePage implements PipeTransform {
	transform(items: Array<any>): Array<any> {
		return items.filter(item => item.hp === true);
	}
}
