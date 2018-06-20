import { Component, OnInit, Input } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';

import { AngularFirestore } from 'angularfire2/firestore';

import { introAnim } from '../router.animations';

import { MixpanelService } from '../helpers/mixpanel/mixpanel.service';

import { NgbdModalAskInForum } from './askInForum.modal';
import { MetaService } from '../helpers/meta/meta.service';

import { Observable } from 'rxjs';

@Component({
	selector: 'app-forum',
	templateUrl: './forum.component.html',
	styleUrls: ['./forum.component.scss'],
	animations: [introAnim]
})
export class ForumComponent implements OnInit {
	@Input() isFull = true;
	threads = [];
	public limitToLast = 6;
	public lastThreadCreated = 9000000000000;
	public showHits = false;

	public algoliaConfig = {
		apiKey: '1c7d7f8c960f3ee5bfd5acc752a793ea',
		appId: 'S2I95AGWAJ',
		indexName: 'forum',
		routing: true,
		searchFunction: helper => {
			if (helper.state.query === '') {
				this.showHits = false;
				return;
			} else {
				helper.search();
				this.showHits = true;
			}
		}
	};

	constructor(
		private db: AngularFirestore,
		private modalService: BsModalService,
		public mixpanel: MixpanelService,
		private meta: MetaService
	) {}

	ngOnInit() {
		if (this.isFull) {
			this.meta.set('Forum', 'A community page for Dride users\'s');
		}
		this.limitToLast = this.isFull ? 20 : 6;
		this.getThreads(this.limitToLast);
	}

	getThreads(limitToLast: number) {
		this.db
			.collection('forum', ref =>
				ref
					.where('hidden', '==', false)
					.orderBy('created', 'desc')
					.limit(limitToLast)
					.where('created', '<', this.lastThreadCreated)
			)
			.valueChanges()
			.subscribe(nodes => {
				this.threads = this.threads.concat(nodes);
				if (nodes.length) {
					this.lastThreadCreated = nodes[nodes.length - 1]['created'];
				}
			});
	}

	ask() {
		this.modalService.show(NgbdModalAskInForum);
	}

	onScroll() {
		this.limitToLast += 20;
		this.getThreads(this.limitToLast);
	}

	transformHits(hits) {
		console.log(hits);
		hits.forEach(hit => {
			hit.stars = [];
			for (let i = 1; i <= 5; i) {
				hit.stars.push(i <= hit.rating);
				i += 1;
			}
		});
		return hits;
	}
}
