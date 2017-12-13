import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UploadVideoComponent } from './cloud/upload-video/upload-video.component';

const routes: Routes = [{
	path: '',
	children: [
		{ path: '', loadChildren: './main/main.module#MainModule'},
		{ path: 'forum', loadChildren: './forum/forum.module#ForumModule'},
		{ path: 'thread', redirectTo: 'forum' },
		{ path: 'thread/:slug', loadChildren: './forum/thread/thread.module#ThreadModule' },
		{ path: 'forum/:slug', loadChildren: './forum/thread/thread.module#ThreadModule' },
		{ path: 'about', loadChildren: './content/about/about.module#AboutModule'},
		{ path: 'fleet', loadChildren: './content/fleet/fleet.module#FleetModule'},
		{ path: '3rd-party-manufacturers', loadChildren: './content/3rd-party/3rd-party.module#TPartyModule'},
		{ path: 'dride1', loadChildren: './content/dride1/dride1.module#Dride1Module'},
		{ path: 'features', loadChildren: './content/zero/zero.module#ZeroModule'},
		{ path: 'documentation', loadChildren: './documentation/documentation.module#DocumentationModule' },
		{ path: 'documentation/:slug', loadChildren: './documentation/documentation.module#DocumentationModule'},
		{ path: 'c/:slug', redirectTo: '/documentation/:slug', pathMatch: 'full' },
		{ path: 'store', loadChildren: './store/store.module#StoreModule'},
		{ path: 'product/:productSlug', loadChildren: './store/product/product.module#ProductModule' },
		{ path: 'profile/:uid/:videoId', loadChildren: './profile/profile.module#ProfileModule' },
		{ path: 'profile/:uid', loadChildren: './profile/profile.module#ProfileModule', data: { meta: { title: 'Profile' } } },
		{ path: 'cloud', loadChildren: './cloud/cloud.module#CloudModule'},
		{ path: 'cloud/uploadVideo', loadChildren: './cloud/upload-video/upload-video.module#UploadVideoModule'},
		{ path: 'settings', loadChildren: './settings/settings.module#SettingsModule'},
		{ path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule'},


		{ path: 'page-not-found', component: PageNotFoundComponent },
		{ path: '**', component: PageNotFoundComponent }
	]
}];


export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules});

