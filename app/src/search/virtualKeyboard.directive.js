angular.module('evtviewer.search')
   .directive('evtVirtualKeyboard', ['evtVirtualKeyboard', function(evtVirtualKeyboard) {
      return {
         restrict: 'E',
         templateUrl: 'src/search/virtualKeyboard.directive.tmpl.html',
         replace: true,
         link: function(scope) {
            evtVirtualKeyboard.build(scope, scope.vm);
         }
      };
   }]);
