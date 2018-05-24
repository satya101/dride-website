import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BsModalService } from 'ngx-bootstrap/modal';

import * as firebase from 'firebase/app';

import { AuthService } from '../auth.service';
import { AngularFireDatabase } from 'angularfire2/database';

import { introAnim } from '../router.animations';

import { MixpanelService } from '../helpers/mixpanel/mixpanel.service';

import { NgbdModalAskInForum } from './askInForum.modal';
import { MetaService } from '../helpers/meta/meta.service';

@Component({
	selector: 'app-forum',
	templateUrl: './forum.component.html',
	styleUrls: ['./forum.component.scss'],
	animations: [introAnim]
})
export class ForumComponent implements OnInit {
	@Input() isFull = true;
	threads: any;

	constructor(
		private db: AngularFireDatabase,
		private modalService: BsModalService,
		public mixpanel: MixpanelService,
		private meta: MetaService
	) {}

	ngOnInit() {
		if (this.isFull) {
			this.meta.set('Forum', "A community page for Dride users's");
		}
		const limitToLast = this.isFull ? 200 : 6;

		this.db
			.list('/threads', ref => ref.orderByChild('lastUpdate').limitToLast(limitToLast))
			.valueChanges()
			.subscribe((arr: any) => {
				const res = [];
				arr.forEach(element => {
					if (!element.hidden) {
						res.unshift(element);
					}
				});
				this.threads = res;
			});
	}

	ask() {
		this.modalService.show(NgbdModalAskInForum);
	}

	getColor(type: string) {
		if (type.toLocaleLowerCase() === 'garmin') {
			return 'badge-info';
		}
		if (type.toLocaleLowerCase() === 'yi') {
			return 'badge-danger';
		}
		if (type.toLocaleLowerCase() === 'drideos') {
			return 'badge-dark';
		}
		if (type.toLocaleLowerCase() === 'new-feature') {
			return 'badge-warning';
		}

		return 'badge-secondary';
	}
}
