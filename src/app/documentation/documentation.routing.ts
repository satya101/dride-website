import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentationComponent } from './documentation.component';

const routes: Routes = [
	{ path: '', component: DocumentationComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
