'use strict';

/**
 * @ngdoc service
 * @name drideApp.devMenu
 * @description
 * # devMenu
 * Factory in the drideApp.
 */
angular.module('drideApp')
  .factory('devMenu', function () {
    // Service logic

    return {

      getMenu: function () {
        return  [
                  {
                    "url": "getting_started",
                    "ttl": "Getting Started",
                    "icon": "icon-toyCar-1",
                    'hp': true
                  },
                  {
                    "url": "dride_cloud",
                    "ttl": "Dride Cloud",
                    "icon": "icon-cloud",
                    "more": "A network of driving footage",
                    'hp': true
                  },
                  {
                    "url": "adas",
                    "ttl": "ADAS",
                    "icon": "icon-camera",
                    "more": "Access the road programmatically",
                    'hp': true
                  },
                  {
                    "url": "assistant",
                    "ttl": "Assistant",
                    "icon": "icon-mic",
                    "more": "Use Dride’s voice engine",
                    'hp': true
                  },
                  {
                    "url": "connectivity",
                    "ttl": "Connectivity",
                    "icon": "icon-wifi",
                    "more": "GPS, Bluetooth & Wifi",
                    'hp': true
                  },
                  {
                    "url": "indicators",
                    "ttl": "Indicators",
                    "icon": "icon-indicator",
                    "more": "Control Dride’s light indicators",
                    'hp': true
                  },
                  {
                    "url": "publish",
                    "ttl": "Publish",
                    "icon": "icon-app",
                    "more": "Learn how to publish an app to Dride",
                    'hp': false
                  }

                ];
      }
    };
  });
