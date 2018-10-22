import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayerModule } from '../../layout/components/player/player.module';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { UniversalComponent } from './universal.component';
import { routing } from './universal.routing';

@NgModule({
	imports: [routing, FormsModule, CommonModule, PlayerModule, SimpleNotificationsModule],
	declarations: [UniversalComponent]
})
export class UniversalModule {}
