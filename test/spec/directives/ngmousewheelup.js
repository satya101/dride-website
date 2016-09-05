'use strict';

describe('Directive: ngMouseWheelUp', function () {

  // load the directive's module
  beforeEach(module('drideApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ng-mouse-wheel-up></ng-mouse-wheel-up>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ngMouseWheelUp directive');
  }));
});
