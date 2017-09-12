import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Dride1Component } from './dride1.component';

const routes: Routes = [
	{ path: '', component: Dride1Component }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
