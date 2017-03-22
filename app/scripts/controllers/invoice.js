'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:InvoiceCtrl
 * @description
 * # InvoiceCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .controller('InvoiceCtrl', function ($mixpanel, $location, $http) {

	var token_triggered = false;
	var handler = StripeCheckout.configure({
	  key: 'pk_live_iEgZDQdwTYeH66NG5BiN8IrP',
	  image: 'https://s3.amazonaws.com/stripe-uploads/acct_18WMZaEuDB8ope0pmerchant-icon-1489669824031-icon.png',
	  locale: 'auto',
	  token: function(token) {
	    // You can access the token ID with `token.id`.
	    // Get the token ID to your server-side code for use.
	    token_triggered = true;

        $http({
            method: 'GET',
            url: 'https://simplest.co.il/lab/dride/payment.php',
            params: { token: token.id, amount: document.getElementById('quantity').value }
        });


	    $mixpanel.track('purchase! ' + token.id);
	  },
	  closed: function() {
          if (!token_triggered) {
              // close button click behavior goes here
              $mixpanel.track('purchase window closed ');
          } else {
              // payment completion behavior goes here
              $mixpanel.track('purchase completed!');
              alert('Your Purchase Was Completed Successfully');
              $location.path('/')
          }
     }
	});

	document.getElementById('quantityUp').addEventListener('click', function(e) {
		document.getElementById('quantity').value++;
	});
	document.getElementById('quantityDown').addEventListener('click', function(e) {
		if (document.getElementById('quantity').value > 1)
			document.getElementById('quantity').value--;
	});
	document.getElementById('customButton').addEventListener('click', function(e) {
	  // Open Checkout with further options:
	  var quantity = document.getElementById('quantity').value;
	  handler.open({
	    name: 'Dride, Inc.',
	    description: quantity + ' Dride prototype(s)',
	    amount: 400*parseInt(quantity)*100,
	    billingAddress: true,
	    shippingAddress: true
	  });
	  e.preventDefault();
	});

	// Close Checkout on page navigation:
	window.addEventListener('popstate', function() {
	  handler.close();
	});



  });
