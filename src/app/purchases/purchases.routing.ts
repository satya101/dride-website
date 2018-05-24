import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchasesComponent } from './purchases.component';

const routes: Routes = [{ path: '', component: PurchasesComponent }];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
