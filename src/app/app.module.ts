import { BrowserModule, Title } from '@angular/platform-browser';
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
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import 'firebase/messaging';

import { UiSwitchModule } from 'ngx-ui-switch';

import { AppComponent } from './app.component';

import { AuthService, NgbdModalLogin } from './auth.service';

import { PushNotificationsService } from './push-notifications.service';
import { MetaService } from './helpers/meta/meta.service';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MixpanelService } from './helpers/mixpanel/mixpanel.service';

import { routing } from './app.routing';
import { SharedModule } from './helpers/shared.module';

import { SsrService } from './helpers/ssr/ssr.service';

import { NgbdModalPayement } from './store/product/payment.modal';
import { NgbdModalAskInForum } from './forum/askInForum.modal';
import { NgbdModalAskToSubscribe } from './layout/nav/askToSubscribe.modal';

import { SimpleNotificationsModule } from 'angular2-notifications';
import { CookieService } from 'ngx-cookie-service';

Raven.config('https://937047e5361c41349ef8dc829947575d@sentry.io/215964').install();

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
		NgbdModalAskInForum,
		NgbdModalAskToSubscribe,
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
		AngularFireStorageModule,
		HttpClientModule,
		AngularFireAuthModule,
		AngularFirestoreModule,
		FormsModule,
		UiSwitchModule,
		SharedModule,
		SimpleNotificationsModule.forRoot()
	],
	providers: [AuthService, PushNotificationsService, MixpanelService, SsrService, MetaService, CookieService],
	bootstrap: [AppComponent],
	entryComponents: [NgbdModalLogin, NgbdModalPayement, NgbdModalAskInForum, NgbdModalAskToSubscribe]
})
export class AppModule {}
