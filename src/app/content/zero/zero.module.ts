import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { ZeroComponent } from './zero.component';
import { routing } from './zero.routing';

@NgModule({
	imports: [routing, FormsModule, CommonModule],
	declarations: [ZeroComponent]
})
export class ZeroModule { }
