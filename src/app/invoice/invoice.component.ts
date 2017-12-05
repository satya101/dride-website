import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MixpanelService } from '../helpers/mixpanel/mixpanel.service';

declare var StripeCheckout: any;


@Component({
	selector: 'app-invoice',
	templateUrl: './invoice.component.html',
	styles: [
		".zroBg {background-image: url(./assets/images/zero/main.jpg); height: 630px; background-repeat: no-repeat; background-position-y: 20%; width: 100%;}"
	]
})
export class InvoiceComponent implements OnInit {
	public quantity = 2;
	constructor(public http: HttpClient, public mixpanel: MixpanelService) { }

	ngOnInit() {
		let token_triggered = false;
		const handler = StripeCheckout.configure({
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
					alert('Your Purchase Was Completed Successfully, Thank you.');
				}
			}
		});


		document.getElementById('customButton').addEventListener('click', (e) => {
			// Open Checkout with further options:
			handler.open({
				name: 'Dride, Inc.',
				description: this.quantity + ' Dride prototype(s)',
				amount: 400 * this.quantity * 100,
				billingAddress: true,
				shippingAddress: true
			});
			e.preventDefault();
		});

		// Close Checkout on page navigation:
		window.addEventListener('popstate', function () {
			handler.close();
		});

	}




}
