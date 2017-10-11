import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CloudComponent } from './cloud.component';

const routes: Routes = [
	{ path: '', component: CloudComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
