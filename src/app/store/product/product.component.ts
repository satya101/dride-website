import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { BsModalService } from 'ngx-bootstrap/modal';


import { AuthService } from '../../auth.service';
import { NgbdModalPayement } from './payment.modal';
import { MixpanelService } from '../../helpers/mixpanel/mixpanel.service';
import { MetaService } from '../../helpers/meta/meta.service'





@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

	productData: FirebaseObjectObservable<any[]>;
	mainImageIndex = '0'
	public firebaseUser: any;

	constructor(db: AngularFireDatabase,
		private route: ActivatedRoute,
		private auth: AuthService,
		private modalService: BsModalService,
		public mixpanel: MixpanelService,
		private meta: MetaService) {


		auth.getState().subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;

		});


		this.route.params.subscribe(params => {

			if (params['productSlug']) {
				this.productData = db.object('content/' + params['productSlug'])
				this.productData.subscribe(
					(data: any) => {
						this.meta.set(
							data.title,
							data.productInfo[0].body
						)
					}
				)
			}

		});

	}

	ngOnInit() {
	}

	/*
	* Update current picture in gallery
	*/
	updateMainPicture(key) {
		this.mainImageIndex = key
	}


	purchase = function () {


		this.auth.verifyLoggedIn().then(res => {


			this.modalService.show(NgbdModalPayement);
			this.mixpanel.track('purchase', {})

			// payment.makePayment($scope.data.price, $scope.data.key, $scope.data.actionBtn)
			// TODO: track

		})

	}



}
