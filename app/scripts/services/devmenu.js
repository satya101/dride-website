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
                  },
                  {
                    "url": "dride_cloud",
                    "ttl": "Dride Cloud",
                    "icon": "icon-dride-cloud",
                    "more": "A network of driving footage"
                  },
                  {
                    "url": "adas",
                    "ttl": "ADAS Cloud",
                    "icon": "icon-camera",
                    "more": "Take advantage of drid's road vision."
                  },
                  {
                    "url": "assistant",
                    "ttl": "Assistant",
                    "icon": "icon-mic",
                    "more": "Use natural language to interact with your users"
                  },
                  {
                    "url": "connectivity",
                    "ttl": "Connectivity",
                    "icon": "icon-gps",
                    "more": "Use dride's build in GPS, Bluetooth & WIFI."
                  },
                  {
                    "url": "indicators",
                    "ttl": "Indicators",
                    "icon": "icon-indicator",
                    "more": "Contorl Dride's light indicators"
                  },
                  {
                    "url": "publish",
                    "ttl": "Publish an app",
                    "icon": "icon-app",
                    "more": "How to publish an app to Dride"
                  }

                ];
      }
    };
  });
