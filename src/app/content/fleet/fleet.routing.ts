import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FleetComponent } from './fleet.component';

const routes: Routes = [
	{ path: '', component: FleetComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
