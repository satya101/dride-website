import { Directive, ElementRef, Input } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@Directive({
	selector: '[edit-page]'
})
export class EditMeDirective {

	constructor(el: ElementRef, location: Location) {
		const fName = location.path().split('/')[2];



		el.nativeElement.innerHTML = `<div class="editDocsLabel">
			<a href="https://github.com/dride/dride-website/edit/master/src/app/documentation/pages/`
			+ this.snakeToCamel(fName) + '/'
			+ this.underToSanke(fName) +
			`.component.html">Edit</a>
		</div>`;
	}

	snakeToCamel(s) {
		return s.replace(/(\_\w)/g, function(m){return m[1].toUpperCase(); });
	}
	underToSanke(s) {
		return s.replace('_', '-');
	}
}
