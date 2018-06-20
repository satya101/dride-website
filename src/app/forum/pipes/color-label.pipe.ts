import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'colorLabel'
})
export class ColorLabelPipe implements PipeTransform {
	transform(items: any[]): any {
		if (!items) {
			return items;
		}
		for (let i = 0; i < items.length; i++) {
			items[i] = {
				name: items[i],
				badgeColor: this.getColor(items[i])
			};
		}
		return items;
	}

	getColor(type: string) {
		if (type.toLocaleLowerCase() === 'garmin') {
			return 'badge-info';
		}
		if (type.toLocaleLowerCase() === 'yi') {
			return 'badge-danger';
		}
		if (type.toLocaleLowerCase() === 'drideos') {
			return 'badge-dark';
		}
		if (type.toLocaleLowerCase() === 'new-feature') {
			return 'badge-warning';
		}

		return 'badge-secondary';
	}
}
