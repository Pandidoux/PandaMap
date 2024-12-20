(function (root, factory) {
    if (typeof define === 'function' && define.amd) { // AMD
        define(['leaflet', '@panoramax/web-viewer'], factory);
    } else if (typeof exports === 'object') { // Node, CommonJS-like
        module.exports = factory(require('leaflet'), require('@panoramax/web-viewer'));
    } else { // Browser globals (root is window)
        root.returnExports = factory(root.L, root.Panoramax);
    }
}(typeof globalThis !== 'undefined' ? globalThis : this || self, function (L, Panoramax) {

    /* Leaflet control plugins inherit from Leaflet's Control class. */
    L.LeafletPanoramaxViewer = L.Control.extend({
        options: {
            api: 'https://api.panoramax.xyz/api', // Panoramax API instances https://api.panoramax.xyz/api/instances
            id: null, // ID of the panoramax viewer
            control: true, // Show a control button
            controlLabel: 'Toggle Panoramax', // Label of the Panoramax viewer control button
            position: 'topleft', // Control button position
            collapsed: false, // Should Panoramax viewer be collapsed on init
            searchRadius: 20, // Size of the search radius around the marker placement
            width: '400px', // Width of the panoramax viewer
            height: '400px', // Height of the panoramax viewer
            clickToMove: true, // Enable/Disable click on map to move the cursor position
            dragAndDrop: true, // Enable/Disable drag and drop to move the cursor position
            resizable: true, // Panoramax viewer can be resized *(1)
            resizableLabel: 'Reset size', // Label of the reset size button
            photoLocationButton: true, // Display photo location toggle button
            photoLocationLimit: 10000, // Limit of photo locations to grab
            photoLocationLabel: 'Photo locations', // Label of the photos locations button
            photoLocationEnabled: false, // Show photo locations on map init
            photoLocationMinZoom: 18, // Minimum zoom to display photos locations 0 -> 20
        },


        /* Leaflet calls the initialize function when an instance of the plugin control is created with a call to new. */
        initialize: function (options) {
            // Combine the control plugin's default options with those passed in as the parameter
            // Continue initializing the control plugin here.
            L.Util.setOptions(this, options);
            this.options.api = (this.options.api.substr(-1) == '/') ? this.options.api.substring(0, this.options.api.length-1) : this.options.api ; // remove last "/"
            this.options.id = (this.options.id) ? this.options.id : `leaflet-psv-${(Math.random() + 1).toString(36).substring(2)}` ;
        },


        /* Leaflet calls the onAdd function when the control is added to the map
        * control.addTo(map);
        * map.addControl(control);
        */
        onAdd: function (map) {
            // Create the DOM element that will contain the control. The leaflet-control-template CSS class is defined in the LeafletPanoramaxViewer.css file.
            // The onAdd function must return the DOM element that contains the plugin control. Leaflet will add this element to the map.
            this._initLayout(); // Create the DOM element that will contain the control.
            return this._container;
        },


        /** Create control UI */
        _initLayout: function () {
            // console.log('_initLayout');
            // Toggle open button
            this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-psv-container');
            this._map._container.appendChild(this._container); // pre injection for panoramax
            this._openButton = L.DomUtil.create('a', 'leaflet-psv-open');
            this._openButton.setAttribute('title', this.options.controlLabel);
            L.DomEvent.disableClickPropagation(this._container);
            L.DomEvent.disableScrollPropagation(this._container);
            this._container.appendChild(this._openButton);

            this._menuBar = L.DomUtil.create('div', 'leaflet-psv-menubar');
            this._container.appendChild(this._menuBar);

            // Panoramax Viewer container
            this._psvContainer = L.DomUtil.create('div', 'leaflet-psv');
            this._container.appendChild(this._psvContainer);
            this._viewer_id = this.options.id;
            this._psvContainer.setAttribute('id', this._viewer_id);
            L.DomEvent.disableClickPropagation(this._psvContainer);
            L.DomEvent.disableScrollPropagation(this._psvContainer);
            this._psvContainer.style.width = this.options.width;
            this._psvContainer.style.height = this.options.height;
            if (this.options.resizable === true) {
                this._psvContainer.style.resize = 'both';
                this._psvContainer.style.overflow = 'auto';
            }
            this._container.style.display = 'flex';

            // Create close button
            this._closeButton = L.DomUtil.create('span', 'leaflet-psv-close');
            this._menuBar.appendChild(this._closeButton);
            this._closeButton.innerText = 'x';
            this._closeButton.setAttribute('title', this.options.controlLabel);

            this._toolsBar = L.DomUtil.create('div', 'leaflet-psv-toolsbar');
            this._menuBar.appendChild(this._toolsBar);

            this._sizeResetButton = L.DomUtil.create('span', 'leaflet-psv-sizeresetbutton');
            if (this.options.resizable === true) {
                this._toolsBar.appendChild(this._sizeResetButton);
            }
            this._sizeResetButton.setAttribute('title', this.options.resizableLabel);

            this._photoLocationButton = L.DomUtil.create('span', 'leaflet-psv-photolocationbutton');
            this._toolsBar.appendChild(this._photoLocationButton);
            if (this.options.photoLocationButton == false) {
                this._photoLocationButton.style.display = 'none';
            }
            if (this.options.photoLocationEnabled == true) {
                this._photoLocationButton.classList.add('leaflet-psv-photolocationenable');
            }
            this._photoLocationButton.setAttribute('title', this.options.photoLocationLabel);

            if (this.options.position.includes('left')) { // viewer position => left
                this._closeButton.style.borderRight = '1px solid #ccc';
                this._menuBar.style.flexDirection = 'row';
                this._toolsBar.style.flexDirection = 'row-reverse';
                this._sizeResetButton.style.borderLeft = '1px solid #ccc';
                this._photoLocationButton.style.borderLeft = '1px solid #ccc';
            } else if (this.options.position.includes('right')) { // viewer position => right
                this._closeButton.style.borderLeft = '1px solid #ccc';
                this._menuBar.style.flexDirection = 'row-reverse';
                this._toolsBar.style.flexDirection = 'row';
                this._sizeResetButton.style.borderRight = '1px solid #ccc';
                this._photoLocationButton.style.borderRight = '1px solid #ccc';
            }
            if (this.options.position.includes('top')) { // viewer position => top
                this._container.style.flexDirection = 'column';
                this._menuBar.style.borderBottom = '1px solid #ccc';
            } else if (this.options.position.includes('bottom')) { // viewer position => bottom
                this._container.style.flexDirection = 'column-reverse';
                this._menuBar.style.borderTop = '1px solid #ccc';
            }
            // Lock viewer resize
            if (this.options.resizable === true) {
                if (this.options.position == 'topright') {
                    this._psvContainer.style.resize = 'vertical'; // override css
                }
                if (this.options.position == 'bottomleft') {
                    this._psvContainer.style.resize = 'horizontal'; // override css
                }
                if (this.options.position == 'bottomright') {
                    this._psvContainer.style.resize = 'none'; // override css
                }
            }

            this._postInit();
        },


        /** Post control elements creation */
        _postInit: function () {
            // Toggle open button
            this._openButton.addEventListener('click', () => {
                this.open();
            });
            // Toggle close button
            this._closeButton.addEventListener('click', () => {
                this.close();
            });
            // Size reset button
            this._sizeResetButton.addEventListener('click', () => {
                this.resetSize();
            });
            // Photo location button
            this._photoLocationButton.addEventListener('click', () => {
                this._photoLocationButton.classList.toggle('leaflet-psv-photolocationenable');
                this._setPhotoLocationLayer();
            });
            // Story container
            if (this.options.collapsed !== true) {
                this.open();
            } else {
                this.close();
            }
        },


        /** Create the panoramax PhotoShpere Viewer */
        _createPanoramaxPSV: function () {
            let viewer_id = this._viewer_id;
            this._viewer = new Panoramax.Viewer(viewer_id, this.options.api, {
                // https://panoramax.gitlab.io/gitlab-profile/web-viewer/02_Usage/#map
                map: false, // (boolean | object) Enable contextual map for locating pictures. Setting to true or passing an object enables the map. Various settings can be passed, either the ones defined here, or any of MapLibre GL settings (optional, default false)
            });
            this._viewer.addEventListener('psv:picture-loaded', (e) => {
                // console.log('psv:picture-loaded e =', e);
                // Update Map Marker
                let picture_latlng = L.latLng(e.detail.lat, e.detail.lon);
                this._map.panTo(picture_latlng, {
                    animate: true,
                    duration: 0.5,
                    easeLinearity: 0.5,
                });
                this._marker.setLatLng(picture_latlng);
                this._marker_azimuth = e.target.psv._myVTour.state.currentNode.properties["view:azimuth"];
                this._collection = e.target.psv._myVTour.state.currentNode.sequence.id;
                this._rotateMarker();
            }, this);

            this._viewer.addEventListener('ready', (e) => {
                // console.log('_viewer ready e =',e);
                this.setLocation(this._marker._latlng);
            },{ once: true });

            // console.log('New Viewer =',this._viewer);

        },


        /** Toggle the marker to select a location on the map
         * @param {Boolean} state marker state enable/disable
         */
        _toggleMarker: function(state) {

            if (!this._marker) { // marker doesn't exist
                let latlng = this._map.getCenter();
                const iconSize = 35;
                this._marker = L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: 'data:image/png;base64,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',
                        iconSize: [iconSize, iconSize],
                        iconAnchor: [iconSize/2, iconSize/2],
                        popupAnchor: [0, -iconSize/2],
                    }),
                    draggable: this.options.dragAndDrop,
                    bubblingMouseEvents: false,
                });
                // console.log('New marker =', this._marker);
            }

            if (!this._searchArea) { // searchArea doesn't exist
                let latlng =this._map.getCenter();
                this._searchArea = L.circle(latlng, {
                    radius: this.options.searchRadius,
                    stroke: false,
                    fill: true,
                    fillColor: '#0088FF',
                    fillOpacity: 0.2,
                    interactive: false,
                    bubblingMouseEvents: false,
                })
                // console.log('New searchArea =', this._searchArea);
            }

            if (state === true) { // Enable marker
                // Add marker to the map
                this._marker.addTo(this._map);
                // Set marker azimuth when added to map
                this._rotateMarker();


                if (this.options.dragAndDrop === true) {
                    // Remove searchArea when marker dropped
                    // console.log('_marker dragstart ON');
                    this._marker.on('dragstart', this._marker_dragstart, this);

                    // Update viewer when marker is drag and drop
                    // console.log('_marker dragend ON');
                    this._marker.on('dragend', this._marker_dragend, this);
                }

                // Correction map zoom reset marker azimut
                // console.log('_map zoomend ON');
                this._map.on('zoomend', this._map_zoomend, this);

                // Set the photoLocationLayer if enabled
                if (this.options.photoLocationButton === true || this.options.photoLocationEnabled === true) {
                    this._map.on('zoomend', this._setPhotoLocationLayer, this);
                    this._map.on('moveend', this._setPhotoLocationLayer, this);
                    this._map.on('load', this._setPhotoLocationLayer, this);
                    if (this._photoLocationLayer) {
                        this._setPhotoLocationLayer();
                    }
                }

                // Click on map move the marker to nearest photo
                if (this.options.clickToMove === true) {
                    // console.log('_map click ON');
                    this._map.on('click', this._map_click, this);
                }

            } else { // Disable marker
                this._marker.removeFrom(this._map);
                this._searchArea.removeFrom(this._map);

                // remove added events
                // console.log('_marker dragend OFF');
                this._marker.off('dragend', this.setLocation);

                // console.log('_marker click OFF');
                // this._marker.off('click', this._marker_click);

                if (this.options.dragAndDrop === true) {
                    // console.log('_marker dragstart OFF');
                    this._marker.off('dragstart', this._marker_dragstart, this);

                    // console.log('_marker dragend OFF');
                    this._marker.off('dragend', this._marker_dragend, this);
                }

                // console.log('_map zoomend OFF');
                this._map.off('zoomend', this._map_zoomend, this);

                if (this.options.photoLocationButton === true || this.options.photoLocationEnabled === true) {
                    this._map.off('zoomend', this._setPhotoLocationLayer, this);
                    this._map.off('moveend', this._setPhotoLocationLayer, this);
                    this._map.off('load', this._setPhotoLocationLayer, this);
                    if (this._photoLocationLayer) {
                        this._photoLocationLayer.removeFrom(this._map);
                    }
                }

                if (this.options.clickToMove === true) {
                    // console.log('_map click OFF');
                    this._map.off('click', this._map_click, this);
                }
            }
        },

        /** Actions on event marker drag start */
        _marker_dragstart: function(e) {
            // console.log('dragstart e =', e);
            delete this._collection;
            this._searchArea.setStyle({
                fillColor: '#0088FF',
            });
            this._searchArea.addTo(this._map);
            // console.log('mousemove ON');
            this._map.on('mousemove', this._cursorMove, this);
        },


        /** Actions on event marker drag end */
        _marker_dragend: function(e) {
            // console.log('dragend e =', e);
            this.setLocation(e.target._latlng);
            // console.log('mousemove OFF');
            this._map.off('mousemove', this._cursorMove, this);
        },


        /** Actions on event map zoom end */
        _map_zoomend: function(e) {
            // console.log('zoomend e =', e);
            this._rotateMarker();
        },


        /** Actions on event map click */
        _map_click: function(e) {
            // console.log('map click e =', e);
            // Prevent map click and search on panoramax buttons click
            if (e.originalEvent.target != this._map._container) {
                return;
            }
            this._searchArea.addTo(this._map);
            this._searchArea.setLatLng(e.latlng);
            this.setLocation(e.latlng);
        },


        /** Allow to match the panoramax marker to the mouse cursor */
        _cursorMove: function(e) {
            let cursor_latlng = e.latlng;
            this._marker.setLatLng(cursor_latlng);
            this._searchArea.setLatLng(cursor_latlng);
        },


        /** Rotate the marker to match the panoramax photo */
        _rotateMarker: function(azimuth) {
            this._marker._icon.style.transformOrigin = 'center';
            this._marker._icon.style.transform = this._marker._icon.style.transform + ` rotate(${this._marker_azimuth}deg)`;
        },


        /** Update data after moved marker
         * @param {L.LatLng} new_latlng New latitude and longitude
        */
        setLocation: function(new_latlng) {
            // console.log('new_latlng =',new_latlng);
            if (typeof new_latlng == 'undefined'){
                return
            };
            let bounds = new_latlng.toBounds(this.options.searchRadius * 2);

            // Search data in area
            fetch(`${this.options.api}/search` + '?' + new URLSearchParams({
                // collections: e.layer.properties.id,
                bbox: bounds.toBBoxString(),
                limit: 1,
            }).toString(), { method: 'GET' }).then((response) => { return response.json() }).then((geojson) => {
                // console.log('geojson =', geojson); // GeoJson recu
                if (geojson.features.length == 0) { // No photo
                    this._searchArea.setStyle({
                        fillColor: '#FF0000',
                    });
                    this._searchArea.setLatLng(new_latlng);
                    this._searchArea.addTo(this._map);
                    return;
                } else {
                    this._searchArea.setStyle({
                        fillColor: '#008800',
                    });
                }
                setTimeout(() => {
                    this._searchArea.removeFrom(this._map);
                }, 500);

                const feature = geojson.features[0];
                if (this._viewer) {
                    this._viewer.select(feature.collection, feature.id, false);
                }

            }).catch((error) => {
                console.error(error);
            });

        },

        _setPhotoLocationLayer: function () {
            // console.log('_setPhotoLocationLayer');
            const bbox = this._map.getBounds().toBBoxString();
            // Do not update photoLocationLayer while a sequence is playing
            if (this._viewer.isSequencePlaying()) {
                return;
            }
            // Do not show photoLocationLayer on small zoom value
            if (this._map.getZoom() < this.options.photoLocationMinZoom) {
                if (this._photoLocationLayer) {
                    this._photoLocationLayer.removeFrom(this._map);
                    delete this._photoLocationLayer;
                }
                this._photoLocationButton.style.opacity = 0.5;
                return;
            } else {
                this._photoLocationButton.style.opacity = null;
            }
            // Button state
            if (this._photoLocationButton.classList.contains('leaflet-psv-photolocationenable')) { // Button enabled
                if (this._photoLocationLayer) {
                    this._photoLocationLayer.addTo(this._map);
                }
            } else { // Button disabled
                if (this._photoLocationLayer) {
                    this._photoLocationLayer.removeFrom(this._map);
                }
                return;
            }

            //TODO https://api.panoramax.xyz/redoc#tag/Collections/operation/get_api-collections-1ca3722588540cec37923bf883e9de09
            // let filters = null;
            // created > '2021-01-01T00:00:00Z'

            // https://api.panoramax.xyz/redoc#tag/Items/operation/get_api-search-5769f3316ef291861415451c98c2e33f
            const getCollections = () => {
                // Get items of a collection
                let params = {
                    // limit: 1000,
                    bbox: bbox,
                };
                fetch(`${this.options.api}/collections` +'?'+ new URLSearchParams(params).toString(),{
                    method: 'GET',
                }).then((response)=>{return response.json()}).then((json)=>{
                    // console.log('collections =', json);
                    let collections_ids = Object.values(json['collections']).map( (obj) => {
                        return obj.id;
                    });
                    let collection_filters = collections_ids.join(',');
                    getItems(collection_filters);
                }).catch((error)=>{
                    console.error(error);
                });
            };

            const getItems = (collection_filters) => {
                // https://api.panoramax.xyz/redoc#tag/Items/operation/get_api-search-5769f3316ef291861415451c98c2e33f
                // Get items of a collection
                let params = {
                    // limit: 25000,
                    limit: this.options.photoLocationLimit,
                    // collections: collection_filters,
                    bbox: bbox,
                };
                const collection_fillColor = '#FF6F00';
                const collection_fillColor_selected = '#1E88E5';
                fetch(`${this.options.api}/search` +'?'+ new URLSearchParams(params).toString(),{
                    method: 'GET',
                }).then((response)=>{return response.json()}).then((geojson)=>{
                    if (geojson.status_code === 400) {
                        window.alert(geojson.message);
                    }
                    if (this._photoLocationLayer) { // Remove current data to update
                        this._photoLocationLayer.removeFrom(this._map);
                        delete this._photoLocationLayer;
                    }
                    // this._photoLocationLayer.addData(geojson);
                    this._photoLocationLayer = L.geoJSON(geojson, {
                        attribution: 'Photos <a href="https://panoramax.fr/" target="_blank">© Panoramax contributors</a>',
                        style: (feature) => {
                            return {
                                radius: 6,
                                stroke: true,
                                color: '#FFF',
                                weight: 1.0,
                                opacity: 1.0,
                                fill: true,
                                fillColor: (this._collection != feature.collection) ? collection_fillColor : collection_fillColor_selected,
                                fillOpacity: 1.0,
                                interactive: true,
                                bubblingMouseEvents: true,
                            };
                        },
                        pointToLayer: (feature, latlng) => {
                            // console.log('feature =', feature);
                            const marker = L.circleMarker(latlng);
                            return marker;
                        },
                        onEachFeature: (feature, layer) => {
                            let content = '';
                            // Object.keys(feature.properties).forEach(key => {
                            //     content += `<b>${key} :</b> ${feature.properties[key]}<br>`;
                            // });
                            content += `<img class="leaflet-psv-photothumbnail" src="${feature.properties['geovisio:thumbnail']}" alt="${feature.properties['geovisio:producer']}">`;
                            layer.bindTooltip(
                            // layer.bindPopup(
                                L.tooltip({
                                // L.popup({
                                    content: content,
                                    sticky: true,
                                    opacity: 1.0,
                                })
                            );
                            layer.on('click', (e) => {
                                const feature = e.target.feature;
                                if (this._viewer) {
                                    this._viewer.select(feature.collection, feature.id, false);
                                }
                            }, this);
                        },
                    }).addTo(this._map);
                    Object.values(this._photoLocationLayer._layers).forEach(layer => {
                        if (layer.options.fillColor == collection_fillColor_selected) {
                            layer.bringToFront();
                        }
                    });
                }).catch((error)=>{
                    console.error(error);
                });
            };

            clearTimeout(this._photoLocationLayer_timeout);
            this._photoLocationLayer_timeout = setTimeout(() => {
                getCollections(this);
                // getItems(this);
            }, 1000);
        },


        /** Reset the Panoramax viewer default size */
        resetSize: function () {
            // console.log('resetSize()');
            this._psvContainer.style.width = this.options.width;
            this._psvContainer.style.height = this.options.height;
        },


        /** Expand Storymap */
        open: function () {
            // console.log('open()');
            if (this.options.control === true) {
                this._openButton.style.display = 'none';
                this._closeButton.style.display = null;
            } else {
                this._openButton.style.display = 'none';
                this._closeButton.style.display = 'none';
                this._container.style.display = null;
            }
            this._menuBar.style.display = null;
            this._psvContainer.style.display = null;

            this._toggleMarker(true);
            if (!this._viewer) {
                this._createPanoramaxPSV();
            }
        },


        /** Collapse Storymap */
        close: function () {
            // console.log('close()');
            if (this.options.control === true) {
                this._openButton.style.display = null;
                this._closeButton.style.display = 'none';
            } else {
                this._openButton.style.display = 'none';
                this._closeButton.style.display = 'none';
                this._container.style.display = 'none';
            }
            this._menuBar.style.display = 'none';
            this._psvContainer.style.display = 'none';
            this._toggleMarker(false);
        },


        /* Leaflet calls the onRemove function when a control is removed from the map:
        * control.removeFrom(map);
        * map.removeControl(control);
        */
        onRemove: function (map) {
            // Tear down the control by releasing resources and removing event listeners, etc.
            if (this._photoLocationLayer) {
                this._photoLocationLayer.removeFrom(this._map);
                delete this._photoLocationLayer;
            }
            this._marker.removeFrom(this._map);
            this._searchArea.removeFrom(this._map);
            this._photoLocationButton.remove();
            this._sizeResetButton.remove();
            this._toolsBar.remove();
            this._closeButton.remove();
            this._openButton.remove();
            this._container.remove();
            try {
                this._viewer.destroy();
            } catch (error) {
                console.warn(error);
            }
            delete this._viewer;
            this._menuBar.remove();
            this._psvContainer.remove();
        },


    });

    /* The standard Leaflet plugin creation pattern is to implement a factory function that
    * enables the creation of the plugin to be chained with other function calls:
    * L.leafletPanoramaxViewer().addTo(map);
    * The common convention is to name the factory function after the class of the control
    * plugin but make the first letter lower case.
    */
    L.leafletPanoramaxViewer = function (options) {
        // return your plugin when you are done
        // return MyLeafletPlugin;
        // return L.LeafletPanoramaxViewer;
        return new L.LeafletPanoramaxViewer(options);
    };



}, window));

