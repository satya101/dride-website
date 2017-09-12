import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { FleetComponent } from './fleet.component';
import { routing } from './fleet.routing';

@NgModule({
	imports: [routing, FormsModule, CommonModule],
	declarations: [FleetComponent]
})
export class FleetModule { }
