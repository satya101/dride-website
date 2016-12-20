'use strict';

describe('Service: devMenu', function () {

  // load the service's module
  beforeEach(module('drideApp'));

  // instantiate service
  var devMenu;
  beforeEach(inject(function (_devMenu_) {
    devMenu = _devMenu_;
  }));

  it('should do something', function () {
    expect(!!devMenu).toBe(true);
  });

});
