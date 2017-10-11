import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreComponent } from './store.component';

const routes: Routes = [
	{ path: '', component: StoreComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
