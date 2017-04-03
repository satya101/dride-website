'use strict';

describe('Controller: ForumThreadCtrl', function () {

  // load the controller's module
  beforeEach(module('drideApp'));

  var ForumThreadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ForumThreadCtrl = $controller('ForumThreadCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(ForumThreadCtrl.awesomeThings.length).toBe(3);
  // });
});
