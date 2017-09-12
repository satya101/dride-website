import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { CloudComponent } from './cloud/cloud.component';

import { ForumComponent } from './forum/forum.component';
import { ThreadComponent } from './thread/thread.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { DocsMainComponent } from './documentation/pages/main.component';
import { StoreComponent } from './store/store.component';
import { ProductComponent } from './store/product.component';
import { ProfileComponent } from './profile/profile.component';
import { UploadVideoComponent } from './cloud/upload-video/upload-video.component';
import { SettingsComponent } from './settings/settings.component';

import { MetaGuard } from '@ngx-meta/core';


const routes: Routes = [{
	path: '',
	canActivateChild: [MetaGuard],
	children: [
		{ path: '', component: MainComponent, data: { meta: {title: 'Home', description: 'Dride is a connected dashcam with safetry alerts and apps.'}}},
		{ path: 'forum', component: ForumComponent, data: { meta: {title: 'Forum', description: 'A community page for Dride users'}}},
		{ path: 'thread', redirectTo: 'forum' },
		{ path: 'thread/:slug', loadChildren: './thread/thread.module#ThreadModule' },
		{ path: 'forum/:slug', loadChildren: './thread/thread.module#ThreadModule' },
		{ path: 'about', loadChildren: './content/about/about.module#AboutModule', data: { meta: {title: 'About', description: 'About Dride'}}  },
		{ path: 'fleet', loadChildren: './content/fleet/fleet.module#FleetModule', data: { meta: {title: 'Fleet', description: 'Use Dride with your fleet'}}  },
		{ path: '3rd-party-manufacturers', loadChildren: './content/3rd-party/3rd-party.module#TPartyModule', data: { meta: {title: 'Fleet', description: 'Use Dride with your fleet'}}  },
		{ path: 'features', loadChildren: './content/dride1/dride1.module#Dride1Module', data: { meta: {title: 'Features', description: 'Dride Features'}} },
		{ path: 'documentation', component: DocumentationComponent, data: { meta: {title: 'Documentation', description: 'How to build a Dride or a Dride app'}} },
		{ path: 'documentation/:slug', component: DocumentationComponent },
		{ path: 'store', component: StoreComponent, data: { meta: {title: 'Store', description: 'Buy A Connected Dash cam'}} },
		{ path: 'product/:productSlug', component: ProductComponent },
		{ path: 'profile/:uid/:videoId', component: ProfileComponent },
		{ path: 'profile/:uid', component: ProfileComponent, data: { meta: {title: 'Profile'}} },
		{ path: 'cloud', component: CloudComponent, data: { meta: {title: 'Home', description: 'Best Dash Cam Videos Every Day.'}} },
		{ path: 'cloud/uploadVideo', component: UploadVideoComponent },
		{ path: 'settings', component: SettingsComponent, data: { meta: {title: 'Settings', description: 'Manage your Dride account'}} },


		{ path: 'page-not-found', component: PageNotFoundComponent },
		// { path: '**', component: PageNotFoundComponent }
	]
}];


export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

