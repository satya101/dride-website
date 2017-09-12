import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { SideNavComponent } from '../layout/side-nav.component';


@Component({
	selector: 'docs-main',
	templateUrl: './main.component.html'
})
export class DocsMainComponent {

	public docMenu: any[]

	constructor(sideNav: SideNavComponent) {
		this.docMenu = sideNav.docMenu;

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
