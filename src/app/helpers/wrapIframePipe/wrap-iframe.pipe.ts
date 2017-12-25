import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'wrapIframe'
})
export class WrapIframePipe implements PipeTransform {

	transform(value: any, args?: any): any {

		const b = value.match(/(<iframe.+?<\/iframe>)/g)
		if (b) {
			return value.replace(b, '<div class="wrapIframe">' + b + '</div>');
		}else {
			return value
		}
	}

}
