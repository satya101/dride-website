import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlayerModule } from '../layout/components/player/player.module';
import { SharedModule } from '../helpers/shared.module';
import { environment } from '../../environments/environment';

import { StudioComponent } from './studio.component';
import { routing } from './studio.routing';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
	imports: [routing, CommonModule, SharedModule, FormsModule, PlayerModule, SimpleNotificationsModule],
	declarations: [StudioComponent]
})
export class StudioModule {}
