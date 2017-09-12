import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThreadComponent } from './thread.component';

const routes: Routes = [
	{ path: '', component: ThreadComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
