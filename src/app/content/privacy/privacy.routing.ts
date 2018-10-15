import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivacyComponent } from './privacy.component';

const routes: Routes = [{ path: '', component: PrivacyComponent }];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
