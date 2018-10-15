import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayerModule } from '../../layout/components/player/player.module';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { PrivacyComponent } from './privacy.component';
import { routing } from './privacy.routing';

@NgModule({
	imports: [routing, FormsModule, CommonModule, PlayerModule, SimpleNotificationsModule],
	declarations: [PrivacyComponent]
})
export class PrivacyModule {}
