import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';


import { TPartyComponent } from './3rd-party.component';
import { routing } from './3rd-party.routing';

@NgModule({
	imports: [routing, CommonModule],
	declarations: [TPartyComponent]
})
export class TPartyModule { }
