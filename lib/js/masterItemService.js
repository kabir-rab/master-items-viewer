define([
	"jquery",
	"qlik",	
    "qvangular"
],
function ( jQuery, qlik, qvangular ) {
	'use strict';
	qvangular.service('masterItemService', [function(){
		
        this.getData = function(){
            var deferred = $.Deferred();
            var app = qlik.currApp(this),
				dimensionList,
                measureList,
                objectDestroyId=[],
                masterItemsList=[],
                destroyObject = function(objectId){
                    var deferred = $.Deferred(),
                        destroyedConfirmation=[];
                    $.each(objectId, function(kye, id){
                        app.destroySessionObject(id)
                        .then(function(a){
                            destroyedConfirmation.push({id:id,message:a});
                        });
                    });
                    if(destroyedConfirmation.length == objectId.length){
                        deferred.resolve(destroyedConfirmation);
                    }
                    return deferred;
                },
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
						expression: "/qDim",
						description: "/qMetaDef/description"
						}
					}
				},
				// qDimensionListDef
				generateDimensionList = app.createGenericObject(
					dimensionCall, function(reply) {
                        objectDestroyId.push(reply.qInfo.qId);
						dimensionList = reply.qDimensionList.qItems;
				}),
				// qMeasureListDef
				generateMeasureList = app.createGenericObject(
					measureCall, function(reply) {
                        objectDestroyId.push(reply.qInfo.qId);
						measureList = reply.qMeasureList.qItems;
				}),
				// get only the master objects that are being used in dashboard
				getMasterObjects = function(id) {
					var deferred = $.Deferred();
					app.getObject(id).then(function(model) {
						deferred.resolve(model);
					});
					return deferred;
                },
                // get list of all sheets
                generateSheetList = function(){
                    var deferred = $.Deferred(),
                        sheetObjectList = [];
                    app.getList( "Sheet", function(sheets){
                        sheetObjectList = sheets.qAppObjectList.qItems;
                    })
                    .then(function(sheets){
                        app.destroySessionObject(sheets.id)
                        .then(function(a){
                            deferred.resolve(sheetObjectList);
                        });
                    });
                    return deferred;
                },
                allProperty = function(sheets){
                    var deferred = $.Deferred(),
                        fullPropertyTree=[],
                        allObjectProperty=[],
                        sheetsCount = sheets.length;
                    $.each(sheets, function(key, sheet) {
                        generateFullPropertyTree(sheet.qInfo.qId)
                        .then(function(objectProperty){
                            fullPropertyTree.push(objectProperty);
                            if(fullPropertyTree.length == sheetsCount){
                                $.each(fullPropertyTree, function(key, singleProperty){
                                    $.each(singleProperty, function(key, qObject){
                                        if(qObject.qProperty.qExtendsId){
                                            masterItemsList.push(qObject.qProperty.qInfo.qId);
                                        }
                                        else{
                                            allObjectProperty.push(JSON.stringify(qObject));
                                        };
                                    });
                                });
                                fullPropertyTree=[];
                                $.each(masterItemsList, function(key, itemId){
                                    getMasterObjects(itemId).done(function (masterObject){
                                        allObjectProperty.push(JSON.stringify(masterObject.pureLayout));
                                        fullPropertyTree.push(1);
                                    }).done(function(){
                                        if(fullPropertyTree.length == masterItemsList.length){
                                            fullPropertyTree=[];
                                            deferred.resolve(allObjectProperty);
                                        }
                                    });
                                });
                            };
                        });
                    });
                    return deferred;
                }

                var generateFullPropertyTree = function(sheetId){
                    var deferred = $.Deferred(),
                        sheetFullPropertyTree = [];
                    app.getFullPropertyTree(sheetId)
                    .then(function(model){
                        var sheetTitle = model.properties.qMetaDef.title;
                        model.propertyTree.qChildren.forEach(function(p){p.qSheetTitle = sheetTitle;});
                        sheetFullPropertyTree = model.propertyTree.qChildren;
                        deferred.resolve(sheetFullPropertyTree);
                    });
                    return deferred;
                };

                generateSheetList().done(function(sheets){
                    allProperty(sheets).done(function(objectProperty){
                        $.each(dimensionList, function(key, dimension){
                            var holdingObject = [];
                            $.each(objectProperty, function(key, value) {
                                if(value.indexOf('"qId":"') != -1){
                                    var idStartPosition = value.indexOf('"qId":"')+7;
                                    var idFinishPosition = value.indexOf('",', idStartPosition);
                                    var holdingObjectId = value.substring(idStartPosition, idFinishPosition);
                                }
                                if(value.indexOf('"qSheetTitle":"') != -1){
                                    var idStartPosition = value.indexOf('"qSheetTitle":"')+15;
                                    var idFinishPosition = value.indexOf('"', idStartPosition);
                                    var holdingSheetTitle = value.substring(idStartPosition, idFinishPosition);
                                }													
                                if(value.indexOf('"'+dimension.qInfo.qId+'"') > -1){
                                    if(holdingObject.filter(function(qObjectId){ return qObjectId.objectId === holdingObjectId }).length < 1){
                                        holdingObject.push({objectId:holdingObjectId, sheetTitle:holdingSheetTitle});
                                    }
                                }
                            });
                            dimension.qInfo.inObject = holdingObject;
                        });
                        $.each(measureList, function(key, measure){
                            var holdingObject = [];
                            $.each(objectProperty, function(key, value) {
                                if(value.indexOf('"qId":"') != -1){
                                    var idStartPosition = value.indexOf('"qId":"')+7;
                                    var idFinishPosition = value.indexOf('",', idStartPosition);
                                    var holdingObjectId = value.substring(idStartPosition, idFinishPosition);
                                }
                                if(value.indexOf('"qSheetTitle":"') != -1){
                                    var idStartPosition = value.indexOf('"qSheetTitle":"')+15;
                                    var idFinishPosition = value.indexOf('"', idStartPosition);
                                    var holdingSheetTitle = value.substring(idStartPosition, idFinishPosition);
                                }													
                                if(value.indexOf(''+measure.qInfo.qId+'') > -1){
                                    if(holdingObject.filter(function(qObjectId){ return qObjectId.objectId === holdingObjectId }).length < 1){
                                        holdingObject.push({objectId:holdingObjectId, sheetTitle:holdingSheetTitle});
                                    }
                                }
                            });
                            measure.qInfo.inObject = holdingObject;
                        });
                        var qMasterMeasures = {dimensions:dimensionList,measures:measureList};
                        var destroy = destroyObject(objectDestroyId);
                        deferred.resolve(qMasterMeasures);
                    });
                });
            return deferred;
        };
    }]);
});