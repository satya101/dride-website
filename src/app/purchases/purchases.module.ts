import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../helpers/shared.module';
import { environment } from '../../environments/environment';

import { PurchasesComponent } from './purchases.component';
import { routing } from './purchases.routing';

@NgModule({
	imports: [routing, CommonModule, SharedModule, FormsModule],
	declarations: [PurchasesComponent]
})
export class PurchasesModule {}
