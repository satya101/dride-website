import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'wrapIframe'
})
export class WrapIframePipe implements PipeTransform {

	transform(value: any, args?: any): any {

		const b = value.match(/(<iframe.+?<\/iframe>)/g)[0]
		console.log(b)
		return value.replace(b, '<div class="wrapIframe">' + b + '</div>');
	}

}
