import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';

import * as Raven from 'raven-js';


// BS4 plugins
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import 'firebase/storage';
import 'firebase/messaging';

import { MetaModule, MetaLoader, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';


import { TruncateModule } from 'ng2-truncate';
import { MarkdownToHtmlModule } from 'ng2-markdown-to-html';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { AgmCoreModule, AgmPolygon } from '@agm/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UiSwitchModule } from 'ngx-ui-switch/src'

import { AppComponent } from './app.component';

import { AuthService, NgbdModalLogin } from './auth.service';

import { UserService } from './user.service';
import { PushNotificationsService } from './push-notifications.service';


import { MainComponent } from './main/main.component';
import { CloudComponent } from './cloud/cloud.component';
import { CloudPaginationService } from './cloud/cloud-pagination.service';
import { ForumComponent, NgbdModalAskInForum } from './forum/forum.component';
import { NgbdModalPayement } from './store/payment.modal';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { DocsMainComponent, ShowOnHomePage } from './documentation/pages/main.component';
import { AdasComponent } from './documentation/pages/adas.component';
import { AssistantComponent } from './documentation/pages/assistant.component';
import { ConnectivityComponent } from './documentation/pages/connectivity.component';
import { DrideCloudComponent } from './documentation/pages/dride-cloud.component';
import { GettingStartedComponent } from './documentation/pages/getting-started.component';
import { IndicatorsComponent } from './documentation/pages/indicators.component';
import { ManualSetupComponent } from './documentation/pages/manual-setup.component';
import { PublishComponent } from './documentation/pages/publish.component';
import { SideNavComponent } from './documentation/layout/side-nav.component';
import { PageService } from './documentation/pages.service';
import { DocsPageDirective } from './documentation/pages.directive';

import { CodeComponent } from './helpers/code/code.component';
import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';
import { StoreComponent } from './store/store.component';
import { ProductComponent } from './store/product.component';
import { ProfileComponent, ShowClips, KeysPipe } from './profile/profile.component';
import { UploadVideoComponent } from './cloud/upload-video/upload-video.component';
import { SettingsComponent } from './settings/settings.component';

import { MixpanelService } from './helpers/mixpanel.service';
import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { routing } from './app.routing';
import { SharedModule } from './helpers/shared.module';

import { InViewport } from './helpers/in-viewport.directive';



export function metaFactory(): MetaLoader {
	return new MetaStaticLoader({
		pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
		pageTitleSeparator: ' | ',
		applicationName: 'Dride',
		defaults: {
			title: 'Dride',
			description: 'Mighty Mouse is an animated superhero mouse character',
			'og:image': 'http://localhost:4200/pic3.c633e5ca1b88b3499d11.jpg',
		}
	});
}

// Raven
// .config('https://937047e5361c41349ef8dc829947575d@sentry.io/215964')
// .install();

// export class RavenErrorHandler implements ErrorHandler {
// 	handleError(err: any): void {
// 		Raven.captureException(err);
// 	}
// }


@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		CloudComponent,
		ForumComponent,
		PageNotFoundComponent,
		NgbdModalLogin,
		NgbdModalAskInForum,
		NgbdModalPayement,
		DocumentationComponent,
		DocsMainComponent,
		AdasComponent,
		AssistantComponent,
		ConnectivityComponent,
		DrideCloudComponent,
		GettingStartedComponent,
		IndicatorsComponent,
		ManualSetupComponent,
		PublishComponent,
		SideNavComponent,
		DocsPageDirective,
		ShowOnHomePage,
		CodeComponent,
		NavComponent,
		FooterComponent,
		StoreComponent,
		ProductComponent,
		ProfileComponent,
		ShowClips,
		KeysPipe,
		UploadVideoComponent,
		SettingsComponent,
		InViewport
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'dride' }),
		BrowserAnimationsModule,
		routing,
		ModalModule.forRoot(),
		BsDropdownModule.forRoot(),
		CollapseModule.forRoot(),
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireDatabaseModule,
		HttpClientModule,
		AngularFireAuthModule,
		TruncateModule,
		MarkdownToHtmlModule.forRoot(),
		FormsModule,
		VgCoreModule,
		VgControlsModule,
		VgOverlayPlayModule,
		VgBufferingModule,
		AgmCoreModule.forRoot({
			apiKey: environment.googleMapsApi
		}),
		InfiniteScrollModule,
		UiSwitchModule,
		Ng2PageScrollModule,
		SharedModule,
		MetaModule.forRoot({
			provide: MetaLoader,
			useFactory: (metaFactory)
		})
	],
	providers: [AuthService,
		UserService,
		SideNavComponent,
		PageService,
		CloudPaginationService,
		PushNotificationsService,
		MixpanelService
	],
	bootstrap: [AppComponent],
	entryComponents: [NgbdModalLogin,
		NgbdModalAskInForum,
		NgbdModalPayement,
		DocsMainComponent,
		AdasComponent,
		AssistantComponent,
		ConnectivityComponent,
		DrideCloudComponent,
		GettingStartedComponent,
		IndicatorsComponent,
		ManualSetupComponent,
		PublishComponent,
	],
})
export class AppModule { }
