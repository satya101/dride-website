import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FleetComponent } from './fleet.component';
import { routing } from './fleet.routing';

@NgModule({
	imports: [routing, CommonModule],
	declarations: [FleetComponent]
})
export class FleetModule { }
