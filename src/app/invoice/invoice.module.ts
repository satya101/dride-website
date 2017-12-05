import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InvoiceComponent } from './invoice.component'
import { routing } from './invoice.routing';



@NgModule({
	imports: [routing, FormsModule],
	declarations: [InvoiceComponent]
})
export class InvoiceModule { }
