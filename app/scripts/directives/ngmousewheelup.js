'use strict';

/**
 * @ngdoc directive
 * @name drideApp.directive:ngMouseWheelUp
 * @description
 * # ngMouseWheelUp
 */
angular.module('drideApp')
  .directive('ngMouseWheelUp', function ($rootScope) {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                        var dateNow = new Date().getTime();
                        if ($rootScope.transitionFired && (dateNow - $rootScope.transitionFired <  1000)  )
                            return;
                        



                        // cross-browser wheel delta
                        var event = window.event || event; // old IE support
                        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

                        if(delta > 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelUp);
                                $rootScope.transitionFired = dateNow
                            });
                        
                            // for IE
                            event.returnValue = false;
                            // for Chrome and Firefox
                            if(event.preventDefault) {
                                event.preventDefault();                        
                            }

                        }
            });
        };
  })
 .directive('ngMouseWheelDown', function($rootScope) {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                   
                        var dateNow = new Date().getTime();
                        if ($rootScope.transitionFired && (dateNow - $rootScope.transitionFired <  1000) )
                            return;
                        

                        


                        // cross-browser wheel delta
                        var event = window.event || event; // old IE support
                        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

                        if(delta < 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelDown);
                                $rootScope.transitionFired = dateNow
                            });
                        
                            // for IE
                            event.returnValue = false;
                            // for Chrome and Firefox
                            if(event.preventDefault)  {
                                event.preventDefault();
                            }

                        }
            });
        };
});
