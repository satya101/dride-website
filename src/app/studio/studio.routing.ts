import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudioComponent } from './studio.component';

const routes: Routes = [{ path: '', component: StudioComponent }];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
