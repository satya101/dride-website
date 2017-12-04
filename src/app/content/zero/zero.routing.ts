import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZeroComponent } from './zero.component';

const routes: Routes = [
	{ path: '', component: ZeroComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
