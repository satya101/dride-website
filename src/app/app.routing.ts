import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UploadVideoComponent } from './cloud/upload-video/upload-video.component';

import { MetaGuard } from '@ngx-meta/core';


const routes: Routes = [{
	path: '',
	canActivateChild: [MetaGuard],
	children: [
		{ path: '', loadChildren: './main/main.module#MainModule', data: { meta: { title: 'Home', description: 'Dride is making it easy to share dashcam videos. Visit to learn more about Dride.' } } },
		{ path: 'forum', loadChildren: './forum/forum.module#ForumModule', data: { meta: { title: 'Forum', description: 'A community page for Dride users' } } },
		{ path: 'thread', redirectTo: 'forum' },
		{ path: 'thread/:slug', loadChildren: './forum/thread/thread.module#ThreadModule' },
		{ path: 'forum/:slug', loadChildren: './forum/thread/thread.module#ThreadModule' },
		{ path: 'about', loadChildren: './content/about/about.module#AboutModule', data: { meta: { title: 'About', description: 'About Dride' } } },
		{ path: 'fleet', loadChildren: './content/fleet/fleet.module#FleetModule', data: { meta: { title: 'Fleet', description: 'Use Dride with your fleet' } } },
		{ path: '3rd-party-manufacturers', loadChildren: './content/3rd-party/3rd-party.module#TPartyModule', data: { meta: { title: 'Fleet', description: 'Use Dride with your fleet' } } },
		{ path: 'features', loadChildren: './content/dride1/dride1.module#Dride1Module', data: { meta: { title: 'Features', description: 'Dride Features' } } },
		{ path: 'documentation', loadChildren: './documentation/documentation.module#DocumentationModule', data: { meta: { title: 'Documentation', description: 'How to build a Dride or a Dride app' } } },
		{ path: 'documentation/:slug', loadChildren: './documentation/documentation.module#DocumentationModule', data: { meta: { title: 'Documentation', description: 'How to build a Dride or a Dride app' } } },
		{ path: 'c/:slug', redirectTo: '/documentation/:slug', pathMatch: 'full' },
		{ path: 'store', loadChildren: './store/store.module#StoreModule' , data: { meta: { title: 'Store', description: 'Buy A Connected Dash cam' } } },
		{ path: 'product/:productSlug', loadChildren: './store/product/product.module#ProductModule' },
		{ path: 'profile/:uid/:videoId', loadChildren: './profile/profile.module#ProfileModule' },
		{ path: 'profile/:uid', loadChildren: './profile/profile.module#ProfileModule', data: { meta: { title: 'Profile' } } },
		{ path: 'cloud', loadChildren: './cloud/cloud.module#CloudModule', data: { meta: { title: 'Home', description: 'Best Dash Cam Videos Every Day.' } } },
		{ path: 'cloud/uploadVideo', loadChildren: './cloud/upload-video/upload-video.module#UploadVideoModule', data: { meta: { title: 'Upload Video' } } },
		{ path: 'settings', loadChildren: './settings/settings.module#SettingsModule', data: { meta: { title: 'Settings', description: 'Manage your Dride account' } } },


		{ path: 'page-not-found', component: PageNotFoundComponent },
		{ path: '**', component: PageNotFoundComponent }
	]
}];


export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

