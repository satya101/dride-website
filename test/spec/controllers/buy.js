'use strict';

describe('Controller: BuyCtrl', function () {

  // load the controller's module
  beforeEach(module('drideApp'));

  var BuyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuyCtrl = $controller('BuyCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));


});
