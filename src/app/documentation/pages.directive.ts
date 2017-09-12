import { Directive, ViewContainerRef, Input, Type } from '@angular/core';

@Directive({
	selector: '[docs-page]'
})

export class DocsPageDirective {

	@Input() pageComponent: Type<any>;

	constructor(public viewContainerRef: ViewContainerRef) { }
}
