import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VgCoreModule, VgAPI } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { PlayerComponent } from './player.component';

@NgModule({
	imports: [VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule, CommonModule],
	providers: [VgAPI],
	declarations: [PlayerComponent],
	exports: [PlayerComponent]
})
export class PlayerModule {}
