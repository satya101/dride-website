import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UniversalComponent } from './universal.component';

const routes: Routes = [{ path: '', component: UniversalComponent }];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
