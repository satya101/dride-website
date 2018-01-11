import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { AuthService } from '../../auth.service';
import { NgbdModalPayement } from './payment.modal';
import { MixpanelService } from '../../helpers/mixpanel/mixpanel.service';
import { MetaService } from '../../helpers/meta/meta.service'
import { HttpClient } from '@angular/common/http';

declare var StripeCheckout: any;


@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

	productData: FirebaseObjectObservable<any[]>;
	mainImageIndex = '0'
	public firebaseUser: any;
	public handler: any;
	public key: string;
	public quantity = 1;
	bsModalRef: BsModalRef;

	constructor(db: AngularFireDatabase,
		private route: ActivatedRoute,
		private router: Router,
		private auth: AuthService,
		private modalService: BsModalService,
		public mixpanel: MixpanelService,
		public http: HttpClient,
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
						this.key = data.key
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
		this.initStripePayment()
	}

	/*
	* Update current picture in gallery
	*/
	updateMainPicture(key) {
		this.mainImageIndex = key
	}


	purchase = function () {
		this.auth.verifyLoggedIn().then(res => {
			if (this.key !== 'dride-kit') {
				this.bsModalRef = this.modalService.show(NgbdModalPayement);
				this.bsModalRef.content.title = this.key;
			}else {
				this.payWithStripe()
			}
			this.mixpanel.track('purchase', {})

			// payment.makePayment($scope.data.price, $scope.data.key, $scope.data.actionBtn)
			// TODO: track

		})
	}


	initStripePayment() {
		let token_triggered = false;
		this.handler = StripeCheckout.configure({
			key: 'pk_live_iEgZDQdwTYeH66NG5BiN8IrP',
			image: 'https://s3.amazonaws.com/stripe-uploads/acct_18WMZaEuDB8ope0pmerchant-icon-1489669824031-icon.png',
			locale: 'auto',
			token: (token) => {
				// You can access the token ID with `token.id`.
				// Get the token ID to your server-side code for use.
				token_triggered = true;
				this.mixpanel.track('purchase token ' + token.id, { tok: token });
				this.http
					.get('https://simplest.co.il/lab/dride/payment.php?token=' + token.id + '&amount=' + this.quantity)
					.subscribe(data => {
						this.mixpanel.track('purchase resolved ', { tok: token });
					},
					error => {
						// TODO: log this
						console.error('An error occurred when requesting comments.');
					}

					)


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

	payWithStripe() {
			// Open Checkout with further options:
			this.handler.open({
				name: 'Dride, Inc.',
				description: this.quantity + ' Dride Zero 3D printed prototype',
				amount: 149 * this.quantity * 100,
				billingAddress: true,
				shippingAddress: true,
				allowRememberMe: false,
				receipt_email: this.firebaseUser.email
			});

		// Close Checkout on page navigation:
		window.addEventListener('popstate', () => {
			this.handler.close();
		});
	}
}
