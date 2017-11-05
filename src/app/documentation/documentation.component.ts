import { Component, Input, ViewChild, ComponentFactoryResolver, ViewEncapsulation, OnInit, Directive, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DocsPageDirective } from './pages.directive';
import { PageComponent } from './page.component';
import { PageService } from './pages.service';
import { PageItem } from './page-item';
import { SideNavComponent } from './layout/side-nav.component';
import { introAnim } from '../router.animations';

import { MetaService } from '../helpers/meta/meta.service'

@Component({
	selector: 'app-documentation',
	templateUrl: './documentation.component.html',
	styleUrls: ['./documentation.component.scss'],
	encapsulation: ViewEncapsulation.None,
	animations: [ introAnim ]
})

export class DocumentationComponent implements OnInit {
	// @Input() pages: PageItem[];
	@Input() pages: Object;

	@ViewChild(DocsPageDirective) pageHost: DocsPageDirective;

	public docMenu: any[]

	constructor(sideNav: SideNavComponent,
		private _componentFactoryResolver: ComponentFactoryResolver,
		private pageService: PageService,
		private route: ActivatedRoute,
		private meta: MetaService) {
		this.docMenu = sideNav.docMenu;
	}

	ngOnInit() {
		this.meta.set(
			'Documentation',
			'How to build a dashcam with a RaspberryPi and how to build Dride apps'
		)

		this.pages = this.pageService.getPages();
		this.route.params.subscribe(params => {
			if (params.slug) {
				this.loadComponent(params.slug);
			} else {
				this.loadComponent('DocsMainComponent');
			}
		})
	}

	loadComponent(currentAddIndex: string) {

		const adItem = this.pages[currentAddIndex];
		const componentFactory = this._componentFactoryResolver.resolveComponentFactory(adItem.component);

		const viewContainerRef = this.pageHost.viewContainerRef;
		viewContainerRef.clear();

		const componentRef = viewContainerRef.createComponent(componentFactory);
		(<PageComponent>componentRef.instance).data = adItem.data;
	}


}


