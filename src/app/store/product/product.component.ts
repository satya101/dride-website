import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AngularFireDatabase } from 'angularfire2/database';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { AuthService } from '../../auth.service';
import { NgbdModalPayement } from './payment.modal';
import { MixpanelService } from '../../helpers/mixpanel/mixpanel.service';
import { MetaService } from '../../helpers/meta/meta.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var StripeCheckout: any;

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss']
})
export class ProductComponent {
	public productData: any;
	mainImageIndex = '0';
	public firebaseUser: any;
	public handler: any;
	public key: string;
	public quantity = 1;
	bsModalRef: BsModalRef;

	constructor(
		db: AngularFireDatabase,
		private route: ActivatedRoute,
		private router: Router,
		private auth: AuthService,
		private modalService: BsModalService,
		public mixpanel: MixpanelService,
		public http: HttpClient,
		private meta: MetaService
	) {
		auth.getState().subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;
		});

		this.route.params.subscribe(params => {
			if (params['productSlug']) {
				db
					.object('content/' + params['productSlug'])
					.valueChanges()
					.subscribe((data: any) => {
						this.productData = data;
						this.key = data.key;
						this.meta.set(data.title, data.productInfo[0].body);
					});
			}
		});
	}

	/*
	* Update current picture in gallery
	*/
	updateMainPicture(key) {
		this.mainImageIndex = key;
	}

	purchase = function() {
		this.auth.verifyLoggedIn().then(res => {
			if (this.key !== 'dride-kit' && this.key !== 'dride-hat') {
				this.bsModalRef = this.modalService.show(NgbdModalPayement);
				this.bsModalRef.content.title = this.key;
			} else {
				this.payWithStripe(this.productData.price, this.productData.receiptTitle, this.productData.shippingPrice);
			}
			this.mixpanel.track('purchase', {});

			// payment.makePayment($scope.data.price, $scope.data.key, $scope.data.actionBtn)
			// TODO: track
		});
	};

	initStripePayment(productId: string, price: number, shippingPrice: number, uid: string) {
		let token_triggered = false;
		this.handler = StripeCheckout.configure({
			key: 'pk_live_iEgZDQdwTYeH66NG5BiN8IrP',
			image: 'https://s3.amazonaws.com/stripe-uploads/acct_18WMZaEuDB8ope0pmerchant-icon-1489669824031-icon.png',
			locale: 'auto',
			token: token => {
				token_triggered = true;
				this.mixpanel.track('purchase token ' + token.id, { tok: token });
				this.http
					.get(
						'https://us-central1-dride-2384f.cloudfunctions.net/issuePurcahse?uid=' +
							uid +
							'&sum=' +
							(price * this.quantity + shippingPrice) * 100 +
							'&quantity=' +
							this.quantity +
							'&productId=' +
							productId +
							'&amount=' +
							this.quantity +
							'&description=' +
							this.getTitle(this.productData.receiptTitle) +
							'&token=' +
							JSON.stringify(token)
					)
					.subscribe(
						data => {
							// save purchase to DB
							this.mixpanel.track('purchase resolved ', { tok: token });
						},
						error => {
							this.mixpanel.track('purchase failed!', { error: error });
							console.error('An error occurred when requesting comments.');
						}
					);
			},
			closed: () => {
				if (!token_triggered) {
					// close button click behavior goes here
					this.mixpanel.track('purchase window closed ', {});
				} else {
					// payment completion behavior goes here
					this.mixpanel.track('purchase completed!', {});
					this.router.navigate(['/forum/super-secret-thread____-L0ER14GVL6GKDF5svCq']);
				}
			}
		});
	}

	payWithStripe(price, title, shippingPrice) {
		this.initStripePayment(this.key, price, shippingPrice, this.firebaseUser.uid);

		// Open Checkout with further options:
		this.handler.open({
			name: 'Dride, Inc.',
			description: this.getTitle(title),
			amount: (price * this.quantity + shippingPrice) * 100,
			billingAddress: true,
			shippingAddress: true,
			allowRememberMe: false
		});

		// Close Checkout on page navigation:
		window.addEventListener('popstate', () => {
			this.handler.close();
		});
	}

	downQ() {
		if (this.quantity > 1) {
			this.quantity--;
		}
	}
	upQ() {
		if (this.quantity < 10) {
			this.quantity++;
		}
	}

	getTitle(title) {
		return '(' + this.quantity + ')' + ' ' + title;
	}
}
