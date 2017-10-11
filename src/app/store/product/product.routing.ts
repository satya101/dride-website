import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from './product.component';

const routes: Routes = [
	{ path: '', component: ProductComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
