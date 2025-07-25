/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtPrimarySourcesParser
 * @description 
 * # evtPrimarySourcesParser
 * Service containing methods to parse data regarding primary source information
 *
 * @requires evtviewer.dataHandler.parsedData
**/
angular.module('evtviewer.dataHandler')

.service('evtPrimarySourcesParser', ['parsedData', function(parsedData) {
	var parser = { };

	var defSurfaceElement = 'surface',
		defGraphicElement = 'graphic',
		defZoneElement = 'zone';
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtPrimarySourcesParser#parseZones
     * @methodOf evtviewer.dataHandler.evtPrimarySourcesParser
     *
     * @description
     * This method will parse zones in a given <code>facsimile</code> element
     * and store them into {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     * Zones will be used for Image-Text linking.
     *
     * @param {element} facsimile XML element to be parsed
     *
     * @author CDP
     */
	parser.parseZones = function(facsimile) {
		var currentFacsimile = angular.element(facsimile);
		angular.forEach(currentFacsimile.find(defSurfaceElement), 
			function(surfaceElement) {
				var surfaceId = surfaceElement.getAttribute('xml:id'),
					surfaceCorresp = surfaceElement.getAttribute('corresp');
				surfaceCorresp = surfaceCorresp ? surfaceCorresp.replace('#', '') : surfaceCorresp;
				var pageWidth = {};
				var pageHeight = {};
				//TODO: decide if it's better to save facsimile infos in page object model	
				angular.forEach(surfaceElement.childNodes, function(child){
					if (child.tagName === defGraphicElement) {
						var newGraphic = {};

						if (child.attributes) {
							for (var i = 0; i < child.attributes.length; i++) {
								var attrib = child.attributes[i];
								if (attrib.specified) {
									var attrName = attrib.name === 'xml:id' ? 'id' : attrib.name.replace(':', '-');
									newGraphic[attrName] = attrib.value;
								}
							}
						}
						newGraphic.page = surfaceCorresp;
						newGraphic.id = newGraphic.id && newGraphic.id.length > 0 ? newGraphic.id.length : surfaceId;
						pageWidth[newGraphic.page] = newGraphic['width'];
						pageHeight[newGraphic.page] = newGraphic['height'];
						parsedData.addGraphic(newGraphic);

					}
				});
				angular.forEach(surfaceElement.childNodes, function(child){
					if (child.tagName === defZoneElement) {
						var newZone = {};

						if (child.attributes) {
							for (var i = 0; i < child.attributes.length; i++) {
								var attrib = child.attributes[i];
								if (attrib.specified) {
									var attrName = attrib.name === 'xml:id' ? 'id' : attrib.name.replace(':', '-');
									newZone[attrName] = attrib.value;
								}
							}
						}
						newZone.page = surfaceCorresp;
						if (pageWidth[newZone.page] && pageWidth[newZone.page].length > 0) { newZone.width = parseInt(pageWidth[newZone.page].replace(/px$/gi,''),10); }
						if (pageHeight[newZone.page] && pageHeight[newZone.page].length > 0) { newZone.height = parseInt(pageHeight[newZone.page].replace(/px$/gi,''),10); }
						parsedData.addZone(newZone);
						
					}
				});
		});
		console.log('## GRAPHICS ##', parsedData.getGraphics());
		console.log('## ZONES ##', parsedData.getZones());
	};

	return parser;
}]);