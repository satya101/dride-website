import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { Dride1Component } from './dride1.component';
import { routing } from './dride1.routing';

@NgModule({
	imports: [routing, FormsModule, CommonModule],
	declarations: [Dride1Component]
})
export class Dride1Module { }
