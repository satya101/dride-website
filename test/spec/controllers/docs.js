'use strict';

describe('Controller: DocsCtrl', function () {

  // load the controller's module
  beforeEach(module('drideApp'));

  var DocsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DocsCtrl = $controller('DocsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(DocsCtrl.awesomeThings.length).toBe(3);
  // });
});
