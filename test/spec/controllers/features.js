'use strict';

describe('Controller: FeaturesCtrl', function () {

  // load the controller's module
  beforeEach(module('drideApp'));

  var FeaturesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FeaturesCtrl = $controller('FeaturesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(FeaturesCtrl.awesomeThings.length).toBe(3);
  // });
});
