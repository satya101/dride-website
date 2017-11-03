import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './timeAgoPipe/timeAgo.pipe';
import { KeysPipe } from './keys.pipe';


@NgModule({
	declarations: [TimeAgoPipe, KeysPipe],
	exports: [TimeAgoPipe, KeysPipe]
})
export class SharedModule {}
