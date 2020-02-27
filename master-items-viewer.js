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
			export: false,
			exportData: false,
			snapshot: true
		},
		template: template,
		controller: ['$scope', function( $scope ) {
			var app = qlik.currApp(this),
				searchValue='',
				nonMasterItemProp=[],
				masterItemProp=[],				
				dimensionList,
				measureList,
				// settings up the createGenericObject call for the qMeasureListDef
				measureCall = {
					qInfo: {
					qId:"measureObjectExt",	
					qType: "MeasureListExt"
					},
					qMeasureListDef: {
					qType: "measure",
					qData: {
						title: "/qMetaDef/title",
						tags: "/qMetaDef/tags",
						expression: "/qMeasure/qDef",
						description: "/qMetaDef/description"
						}
					}
				},
				// settings up the createGenericObject call for the qDimensionListDef
				dimensionCall = {
					qInfo: {
					qId:"DimensionObjectExt",
					qType: "DimensionListExt"
					},
					qDimensionListDef: {
					qType: "dimension",
					qData: {
						grouping: "/qDim/qGrouping",
						info: "/qDimInfos",
						title: "/qMetaDef/title",
						tags: "/qMetaDef/tags",
						expression: "/qDimension/qDef",
						description: "/qMetaDef/description"
						}
					}
				},
				// qDimensionListDef
				generateDimensionList = app.createGenericObject(
					dimensionCall, function(reply) {
						dimensionList = reply.qDimensionList.qItems;
				}),
				// qMeasureListDef
				generateMeasureList = app.createGenericObject(
					measureCall, function(reply) {
						measureList = reply.qMeasureList.qItems;
				}),
				// Starting loop to fetch all sheets id > then extended children property
				appObjectsProperty = app.getList( "Sheet", function(reply){	
					var sheetCounter = 0,
						objectCounter = 0;
					$.each(reply.qAppObjectList.qItems, function(key, value) {
						app.getFullPropertyTree(value.qInfo.qId).then(function(model){
							sheetCounter ++;
							objectCounter = 0;
							$.each(model.propertyTree.qChildren, function(key, value) {
								objectCounter ++;
								let parent = sheetCounter == reply.qAppObjectList.qItems.length;
								let clild = objectCounter == model.propertyTree.qChildren.length;								
								if(value.qProperty.qExtendsId){
									masterItemProp.push(value);
								}
								else{
									nonMasterItemProp.push(JSON.stringify(value));
								};
								if (parent && clild) {
									//console.log("nonMasterItemProp",nonMasterItemProp);
									$.each(dimensionList, function(key, dValue){										
										var holdingObject = [];										
										$.each(nonMasterItemProp, function(key, value) {
											if(value.indexOf('"qId":"') != -1){
												var idStartPosition = value.indexOf('"qId":"')+7;
												var idFinishPosition = value.indexOf('",', idStartPosition);
												var holdingObjectId = value.substring(idStartPosition, idFinishPosition);
											}
											if(value.indexOf('"'+dValue.qInfo.qId+'"') > -1){												
												if($.inArray(holdingObjectId, holdingObject) == -1){
													holdingObject.push(holdingObjectId);
												}												
											}
										});										
										dValue.qInfo.inobject = holdingObject;
									});
									$.each(measureList, function(key, dValue){
										var holdingObject = [];										
										$.each(nonMasterItemProp, function(key, value) {
											if(value.indexOf('"qId":"') != -1){
												var idStartPosition = value.indexOf('"qId":"')+7;
												var idFinishPosition = value.indexOf('",', idStartPosition);
												var holdingObjectId = value.substring(idStartPosition, idFinishPosition);
											}
											if(value.indexOf('"'+dValue.qInfo.qId+'"') > -1){												
												if($.inArray(holdingObjectId, holdingObject) == -1){
													holdingObject.push(holdingObjectId);
												}
											}
										});										
										dValue.qInfo.inobject = holdingObject;
										//console.log(dValue);
									});
									var firstDisplay = getMasterLibrary(1);
								};
							});
						});
					});
				}),
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
				},
				// function to create generic object for Master Dimensions and Master Measures
				getMasterLibrary = function(callType){					
					callType == 1 ? ($scope.measureDetails = measureList, createTagList($scope.measureDetails))
									: ($scope.measureDetails = dimensionList,createTagList($scope.measureDetails));
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