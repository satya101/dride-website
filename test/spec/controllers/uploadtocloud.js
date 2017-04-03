'use strict';

describe('Controller: UploadtocloudCtrl', function () {

  // load the controller's module
  beforeEach(module('drideApp'));

  var UploadtocloudCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UploadtocloudCtrl = $controller('UploadtocloudCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UploadtocloudCtrl.awesomeThings.length).toBe(3);
  });
});
