'use strict';

describe('Controller: DevmenuCtrl', function () {

  // load the controller's module
  beforeEach(module('drideApp'));

  var DevmenuCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DevmenuCtrl = $controller('DevmenuCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DevmenuCtrl.awesomeThings.length).toBe(3);
  });
});
