angular.module('evtviewer.search')

.controller('SearchResultsCtrl',['$scope', 'evtSearchResults', 'evtInterface', 'Utils',
   function($scope,evtSearchResults, evtInterface, Utils) {
   var vm = this;
   
   vm.currentEdition = evtInterface.getState('currentEdition');
   vm.currentEditionResults = [];
   vm.visibleRes = [];
   vm.placeholder = '';
   
   vm.getResultsNumber = function() {
      var results = vm.currentEditionResults,
         resNumber = 0;
   
      if (results) {
         results.forEach(function(result) {
            resNumber += result.resultsNumber;
         });
      }
   
      return resNumber;
   };
   
   vm.getCurrentEditionResults = function () {
     return vm.currentEditionResults;
   };

   vm.getHighlightedOriginalText = function(docId, currentEdition, token, position) {
      var originalText = evtSearchResults.getOriginalText(docId, currentEdition),
         replace = '<strong>' + token + '</strong>',
         startPos = position[0],
         endPos = position[0] + position[1],
         highlightedText = Utils.replaceStringAt(originalText, token, replace, startPos, endPos);
      
         return evtSearchResults.getTextPreview(highlightedText, replace);
   };
   
   vm.loadMoreElements = function() {
      var i = 0,
         lastEl,
         newEl;
      
      while(i < 5 && i < vm.currentEditionResults.length) {
        lastEl = vm.visibleRes.length - 1;
        newEl = vm.currentEditionResults[lastEl + 1];
        
        if(newEl) {
           vm.visibleRes.push(newEl);
        }
        i++;
      }
   };
   
   vm.range = function(lenght) {
      return new Array(lenght);
   };
   
   vm.toggle = function() {
      $(function() {
         $(event.target).toggleClass('active');
         $(event.target ).siblings('.search-result').toggleClass('open');
      });
   };
   
   vm.goToAnchor = function() {
      var eventElement;
      
      evtSearchResultsProvider.closeBox('searchResults');
      evtSearchResultsProvider.showSearchResultsShowBtn();
      eventElement = window.event.currentTarget;
      $(eventElement).addClass('selected');
      vm.goToAnchorPage();
      $(eventElement).removeClass('selected');
   };
   
   vm.goToAnchorPage = function() {
     var anchorPageId = document.getElementsByClassName('resultInfo selected')[0].getElementsByClassName('resultPage')[0].getAttribute('id'),
        anchorDocId = document.getElementsByClassName('resultInfo selected')[0].getElementsByClassName('resultDoc')[0].getAttribute('id');
      
     evtInterface.updateState('currentPage', anchorPageId);
     evtInterface.updateState('currentDoc', anchorDocId);
     evtInterface.updateUrl();
   };
}]);
