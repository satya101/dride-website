import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumComponent } from './forum.component';

const routes: Routes = [
	{ path: '', component: ForumComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
