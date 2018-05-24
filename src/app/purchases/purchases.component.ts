import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';

@Component({
	selector: 'app-purchases',
	templateUrl: './purchases.component.html',
	styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {
	ordersDb: Observable<any[]>;
	orders: any[];
	public status = 'loading';
	public firebaseUser: any;

	constructor(private auth: AuthService, public db: AngularFirestore) {
		auth.getState().subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;
			this.ordersDb = db.collection('purchases', ref => ref.where('uid', '==', this.firebaseUser.uid)).valueChanges();
			this.ordersDb.subscribe(queriedItems => {
				this.orders = queriedItems;
				if (!queriedItems || !queriedItems.length) {
					this.status = 'none';
				} else {
					this.status = 'loaded';
				}
			});
		});
	}

	ngOnInit() {}
}
