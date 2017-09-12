import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TPartyComponent } from './3rd-party.component';

const routes: Routes = [
	{ path: '', component: TPartyComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
