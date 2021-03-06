import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';

import * as Raven from 'raven-js';

// BS4 plugins
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import 'firebase/messaging';

import { UiSwitchModule } from 'ngx-ui-switch';
import { NgAisModule } from 'angular-instantsearch';

import { AppComponent } from './app.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';

import { routing } from './app.routing';
import { SharedModule } from './helpers/shared.module';

import { NgbdModalPayement } from './store/product/payment.modal';
import { NgbdModalAskInForum } from './forum/askInForum.modal';
import { NgbdModalAskToSubscribe } from './layout/nav/askToSubscribe.modal';

import { SimpleNotificationsModule } from 'angular2-notifications';
import { CookieService } from 'ngx-cookie-service';

import { NgbdModalLogin } from './auth.service';

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
		NgbdModalPayement,
		NgbdModalAskInForum,
		NgbdModalAskToSubscribe,
		NavComponent,
		FooterComponent,
		NgbdModalLogin
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
		SimpleNotificationsModule.forRoot(),
		NgAisModule.forRoot()
	],
	providers: [CookieService],
	bootstrap: [AppComponent],
	entryComponents: [NgbdModalLogin, NgbdModalPayement, NgbdModalAskInForum, NgbdModalAskToSubscribe]
})
export class AppModule {}
