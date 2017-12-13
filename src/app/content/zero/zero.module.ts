import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayerModule } from '../../layout/components/player/player.module'
import { SimpleNotificationsModule } from 'angular2-notifications';


import { ZeroComponent } from './zero.component';
import { routing } from './zero.routing';

@NgModule({
	imports: [routing, FormsModule, CommonModule, PlayerModule, SimpleNotificationsModule],
	declarations: [ZeroComponent]
})
export class ZeroModule { }
