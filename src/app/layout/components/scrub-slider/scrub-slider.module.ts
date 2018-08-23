import { NgModule } from '@angular/core';

import { ScrubSliderComponent } from './scrub-slider';
import { Ng5SliderModule } from 'ng5-slider';

@NgModule({
	declarations: [ScrubSliderComponent],
	imports: [Ng5SliderModule],
	exports: [ScrubSliderComponent],
	entryComponents: [],
	providers: []
})
export class ScrubSliderModule {}
