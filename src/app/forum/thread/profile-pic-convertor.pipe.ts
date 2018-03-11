import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'profilePicConvertor'
})
export class ProfilePicConvertorPipe implements PipeTransform {
	transform(node: any): string {
		if (node.fid) {
			return 'https://graph.facebook.com/' + node.fid + '/picture';
		} else {
			return node.pic;
		}
	}
}
