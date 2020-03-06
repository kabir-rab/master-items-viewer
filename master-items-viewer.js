define([
	"text!./master-items-viewer-template.html",
	"text!./lib/css/master-items-viewer.css",
	"./lib/js/property",
	"jquery",
	"qlik",	
	"./lib/js/masterItemService",
	"./lib/js/table-resizer",
	"./lib/js/jq-highlight",
],
function ( template, cssContent, prop, jQuery, qlik, myService ) {
	'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		definition: prop,
		support: {
			export: false,
			exportData: false,
			snapshot: true
		},
		template: template,
		controller: ['$scope', 'masterItemService', function( $scope, masterItemService ) {
			var masterItems,				
				fetchData = masterItemService.getData().done(function(allMasterItems){	
					masterItems = allMasterItems;
					getMasterLibrary(1);
				}),
				getMasterLibrary = function(callType){					
					callType == 1 ? ($scope.measureDetails = masterItems.measures,createTagList($scope.measureDetails))
									: ($scope.measureDetails = masterItems.dimensions,createTagList($scope.measureDetails));
				},
				searchValue='',
				// create list of all tags with unique values
				createTagList = function(list){
					var tagList=[];
					list.forEach(function(measure){
						if(measure.qData.tags.length > 0){
							measure.qData.tags.forEach(function(tag){
								if(!tagList.includes(tag)){
									tagList.push(tag);
								};
							});
						};
					});
					$scope.tags = tagList;
				};

			$scope.measureCss = 'lui-active'
			// function to change views (dimensions or measures)
			$scope.viewChange = function(viewNo){
				getMasterLibrary(viewNo);
				viewNo == 1 ? ($scope.measureCss = 'lui-active', $scope.dimensionCss = '') : ($scope.measureCss = '', $scope.dimensionCss = 'lui-active');
				$scope.searchTagAndClear('');
			};
			// search highlighter function
			$scope.search = function () {
				searchValue = $('#table-search').val().toLowerCase();
				$('.tr-highlight').removeHighlight();
				$('.tr-highlight').highlight(searchValue);
			};
			// clear search function
			$scope.searchTagAndClear = function (tag) {
				if(tag.length > 0){
					$scope.searchText = tag;
					$scope.search();
				}
				else{
					$('#table-search').val('');
					$scope.searchText = '';	
					$scope.search();
				};
			};
			// sorting function for the view
			$scope.propertyName = 'qData.title';
			$scope.reverse = true;
			$scope.sortBy = function(propertyName) {
				$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
				$scope.propertyName = propertyName;
			};
		}],
		paint: function ($element, layout) {
			// set hight for the scroll bar
			layout.props.tagsFilter == true ? $(".table-container").css("max-height", ($element.height()-200)):$(".table-container").css("max-height", ($element.height()-120));
						
			return qlik.Promise.resolve();
		}
	};
});