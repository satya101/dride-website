import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'hit2post'
})
export class Hit2postPipe implements PipeTransform {
	transform(hit: any[]): any {
		const res = [];
		if (!hit) {
			return hit;
		}
		for (let i = 0; i < hit.length; i++) {
			res[i] = {
				description: hit[i]._highlightResult.body.value,
				threadId: hit[i].threadId,
				cmntsCount: 0,
				title: '',
				slug: '',
				body: '',
				lastUpdate: '',
				labels: []
			};
		}
		console.log('res', res);
		return res;
	}
}
