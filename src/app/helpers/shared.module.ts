import { NgModule } from '@angular/core';
import { TimeAgoPipe } from 'time-ago-pipe';
import { KeysPipe } from './keys.pipe';


@NgModule({
	declarations: [TimeAgoPipe, KeysPipe],
	exports: [TimeAgoPipe, KeysPipe]
})
export class SharedModule {}
