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
                    "ttl": "ADAS Cloud",
                    "icon": "icon-camera",
                    "more": "Take advantage of drid's road vision.",
                    'hp': true
                  },
                  {
                    "url": "assistant",
                    "ttl": "Assistant",
                    "icon": "icon-mic",
                    "more": "Use natural language to interact with your users",
                    'hp': true
                  },
                  {
                    "url": "connectivity",
                    "ttl": "Connectivity",
                    "icon": "icon-gps",
                    "more": "Use dride's build in GPS, Bluetooth & WIFI.",
                    'hp': true
                  },
                  {
                    "url": "indicators",
                    "ttl": "Indicators",
                    "icon": "icon-indicator",
                    "more": "Contorl Dride's light indicators",
                    'hp': true
                  },
                  {
                    "url": "publish",
                    "ttl": "Publish an app",
                    "icon": "icon-app",
                    "more": "How to publish an app to Dride",
                    'hp': false
                  }

                ];
      }
    };
  });
