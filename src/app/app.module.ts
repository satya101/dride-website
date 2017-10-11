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
import { UiSwitchModule } from 'ngx-ui-switch/src'

import { AppComponent } from './app.component';

import { AuthService, NgbdModalLogin } from './auth.service';

import { PushNotificationsService } from './push-notifications.service';


import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MixpanelService } from './helpers/mixpanel/mixpanel.service';

import { routing } from './app.routing';
import { SharedModule } from './helpers/shared.module';

import { SsrService } from './helpers/ssr/ssr.service'


import { NgbdModalPayement } from './store/product/payment.modal';


export function metaFactory(): MetaLoader {
	return new MetaStaticLoader({
		pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
		pageTitleSeparator: ' | ',
		applicationName: 'Dride',
		applicationUrl: 'https://dride.io/',
		defaults: {
			title: 'Dride',
			image: 'https://dride.io/assets/images/logo.svg',
			'fb:app_id': '1825311747740641',
			'og:site_name': 'Dride'
		}
	});
}

Raven
.config('https://937047e5361c41349ef8dc829947575d@sentry.io/215964')
.install();

export class RavenErrorHandler implements ErrorHandler {
	handleError(err: any): void {
		Raven.captureException(err);
	}
}


@NgModule({
	declarations: [
		AppComponent,
		PageNotFoundComponent,
		NgbdModalLogin,
		NgbdModalPayement,
		NavComponent,
		FooterComponent
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
		FormsModule,
		UiSwitchModule,
		SharedModule,
		MetaModule.forRoot({
			provide: MetaLoader,
			useFactory: (metaFactory)
		})
	],
	providers: [AuthService,
		PushNotificationsService,
		MixpanelService,
		SsrService
	],
	bootstrap: [AppComponent],
	entryComponents: [NgbdModalLogin,
		NgbdModalPayement
	],
})
export class AppModule { }
