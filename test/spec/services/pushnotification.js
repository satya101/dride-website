'use strict';

describe('Service: pushNotification', function () {

  // load the service's module
  beforeEach(module('drideApp'));

  // instantiate service
  var pushNotification;
  beforeEach(inject(function (_pushNotification_) {
    pushNotification = _pushNotification_;
  }));

  it('should do something', function () {
    expect(!!pushNotification).toBe(true);
  });

});
