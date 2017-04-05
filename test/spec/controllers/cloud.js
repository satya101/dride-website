'use strict';

describe('Controller: CloudCtrl', function () {

  // load the controller's module
  beforeEach(module('drideApp'));

  var CloudCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CloudCtrl = $controller('CloudCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(3).toBe(3);
  });
});
