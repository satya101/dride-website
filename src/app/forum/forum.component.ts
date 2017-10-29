import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';

import * as firebase from 'firebase/app';

import { AuthService } from '../auth.service';
import {
	AngularFireDatabase,
	FirebaseListObservable
} from 'angularfire2/database';

import { introAnim } from '../router.animations';

import { MixpanelService } from '../helpers/mixpanel/mixpanel.service';

import { NgbdModalAskInForum } from './askInForum.modal';

@Component({
	selector: 'app-forum',
	templateUrl: './forum.component.html',
	styleUrls: ['./forum.component.scss'],
	animations: [ introAnim ]
})
export class ForumComponent implements OnInit {
	@Input() isFull = true;
	threads: any;

	constructor(
		private db: AngularFireDatabase,
		private modalService: BsModalService,
		public mixpanel: MixpanelService
	) { }

	ngOnInit() {

		const r = {
					query:
					{
						orderByChild: 'lastUpdate',
						orderByKey: true
					}
				}

		if (!this.isFull) {
			r.query['limitToLast'] = 4
		}

		this.threads = this.db
			.list('/threads', r)
			.map(arr => arr.reverse());
	}

	ask() {
		this.modalService.show(NgbdModalAskInForum);
	}
}
