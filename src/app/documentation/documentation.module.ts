import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DocsMainComponent, ShowOnHomePage } from './pages/main/main.component';
import { AdasComponent } from './pages/adas/adas.component';
import { AssistantComponent } from './pages/assistant/assistant.component';
import { ConnectivityComponent } from './pages/connectivity/connectivity.component';
import { DrideCloudComponent } from './pages/drideCloud/dride-cloud.component';
import { DrideOSComponent } from './pages/drideOS/dride-os.component';
import { GettingStartedComponent } from './pages/gettingStarted/getting-started.component';
import { IndicatorsComponent } from './pages/indicators/indicators.component';
import { ManualSetupComponent } from './pages/manualSetup/manual-setup.component';
import { PublishComponent } from './pages/publish/publish.component';
import { UniversalComponent } from './pages/drideUniversal/universal.component';
import { AssemblyComponent } from './pages/assembly/assembly.component';
import { SideNavComponent } from './layout/side-nav.component';
import { PageService } from './pages.service';
import { DocsPageDirective } from './pages.directive';
import { ApiComponent } from './pages/api/api.component';
import { HackingComponent } from './pages/hacking/hacking.component';

import { CodeComponent } from '../helpers/code/code.component';

import { DocumentationComponent } from './documentation.component';
import { routing } from './documentation.routing';
import { EditMeDirective } from './directive/edit-me.directive';
import { SubscribeBoxComponent } from '../layout/components/subscribe-box/subscribe-box.component';
import { CookieService } from 'ngx-cookie-service';
import { MarkdownModule } from 'ngx-markdown';

import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
	imports: [routing,
		FormsModule,
		CommonModule,
		SimpleNotificationsModule,
		MarkdownModule.forRoot()],
	declarations: [
					DocumentationComponent,
					CodeComponent,
					DocsMainComponent,
					AdasComponent,
					AssistantComponent,
					ConnectivityComponent,
					DrideCloudComponent,
					DrideOSComponent,
					GettingStartedComponent,
					IndicatorsComponent,
					ManualSetupComponent,
					PublishComponent,
					AssemblyComponent,
					SideNavComponent,
					DocsPageDirective,
					ShowOnHomePage,
					UniversalComponent,
					EditMeDirective,
					SubscribeBoxComponent,
					ApiComponent,
					HackingComponent
				],
				entryComponents: [
					DocsMainComponent,
					AdasComponent,
					AssistantComponent,
					ConnectivityComponent,
					DrideCloudComponent,
					DrideOSComponent,
					GettingStartedComponent,
					IndicatorsComponent,
					ManualSetupComponent,
					PublishComponent,
					UniversalComponent,
					AssemblyComponent,
					SubscribeBoxComponent,
					ApiComponent,
					CodeComponent,
					HackingComponent
				],
				providers: [
					SideNavComponent,
					PageService,
					CookieService
				]
})
export class DocumentationModule { }
