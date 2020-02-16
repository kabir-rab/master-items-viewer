define( [
	"text!./master-items-viewer-template.html",
	"text!./lib/css/master-items-viewer.css",	
	"./lib/js/property",		
	"jquery",		
	"qlik",
	"./lib/js/table-resizer",
	"./lib/js/jq-highlight"	
],

function ( template, cssContent, prop, jQuery, qlik ) {
	'use strict';
	$("<style>").html(cssContent).appendTo("head");		
	return {
		definition: prop,
		support: {
			export: true,
			exportData: false,
			snapshot: true
		},
		template: template,		
		controller: ['$scope', function( $scope ) {				
			var app = qlik.currApp(this);			
			var searchValue='';
			// settings up the createGenericObject call for the qMeasureListDef
			var measureCall = {
				qInfo: {
				  qId: "MeasureList",
				  qType: "MeasureList"
				},
				qMeasureListDef: {
				  qType: "measure",
				  qData: {
					title: "/qMetaDef/title",
					//tags: "/qMetaDef/tags",
					expression: "/qMeasure/qDef",
					description: "/qMetaDef/description"
				  }
				}
			};
			// settings up the createGenericObject call for the qDimensionListDef						
			var dimensionCall = {
				qInfo: {
				  qId: "DimensionList",
				  qType: "DimensionList"
				},
				qDimensionListDef: {
				  qType: "dimension",
				  qData: {
					title: "/qMetaDef/title",
					//tags: "/qMetaDef/tags",
					expression: "/qDimension/qDef",
					description: "/qMetaDef/description"
				  }
				}
			};
			// function to create generic object for Master Dimensions and Master Measures 
			var getMasterLibrary = function(initialization){
				app.createGenericObject(
					initialization == 1 ? measureCall : dimensionCall, 
				function(reply) {					
					initialization == 1 ? $scope.measureDetails = reply.qMeasureList.qItems : $scope.measureDetails = reply.qDimensionList.qItems;								 
				});
			};
			// trigger the first view
			var measureTrigger = getMasterLibrary(1);
			$scope.measureCss = 'lui-active'
			// function to change views (dimensions or measures)
			$scope.viewChange = function(viewNo){							
				getMasterLibrary(viewNo);
				viewNo == 1 ? ($scope.measureCss = 'lui-active', $scope.dimensionCss = '') : ($scope.measureCss = '', $scope.dimensionCss = 'lui-active');
				$scope.searchClear();				
			};
			// search function
			$scope.search = function () {				
				searchValue = $('#table-search').val().toLowerCase();
				$('.tr-search').filter(function () {
					$(this).toggle($(this).attr("data-search").toLowerCase().indexOf(searchValue) > -1);					
				});
				$('.tr-highlight').removeHighlight();
				$('.tr-highlight').highlight(searchValue);								
			};
			// clear search function
			$scope.searchClear = function () {
				if(searchValue.length > 0){					
					$('#table-search').val('');	
					$scope.search();
				};											
			};				
		}],
		paint: function ($element) {
			// set hight for the scroll bar
			$(".table-container").css("max-height", ($element.height()-100));			
			return qlik.Promise.resolve();
		}
	};
});

