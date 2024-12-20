/* Leaflet control plugins inherit from Leaflet's Control class. A common
 * naming convention is to add the name of the control plugin to Leaflet's
 * namespace, which is L.
 */
L.LeafletLayerOpacity = L.Control.extend({
    options: {
        position: 'topright', // Control position
        title: 'Layers opacity', // Control title
        collapse: true, // Should the control be able to collapse (true) or always open (false)
        layers: {}, // Layer objects { "layer1_name":layer1, "layer2_name":layer2 } or Array [layer1, layer2]
        layerOnMap: true, // Only display layers if on map
        step: 1, // Slider opacity step interval
    },

    /* Leaflet calls the initialize function when an instance of the plugin
     * control is created with a call to new.
     */
    initialize: function (options) {
        // Combine the control plugin's default options with those passed in as the parameter
        // console.log('this =', this);
        // console.log('options =', options);
        L.Util.setOptions(this, options);
        // Continue initializing the control plugin here.
    },

    /* Leaflet calls the onAdd function when the control is added to the map:
     * control.addTo(map);
     * map.addControl(control);
     */
    onAdd: function (map) {
        /* Create the DOM element that will contain the control. The leaflet-control-template
         * CSS class is defined in the LeafletLayerOpacity.css file.
         */
        this._initLayout();
        // Continue implementing the control here.

        /* The onAdd function must return the DOM element that contains the plugin
         * control. Leaflet will add this element to the map.
         */
        return this._container;
    },

    /* Leaflet calls the onRemove function when a control is removed from the map:
     * control.removeFrom(map);
     * map.removeControl(control);
     */
    onRemove: function (map) {
        // Tear down the control by releasing resources and removing event listeners, etc.
    },

    /** Create control UI */
    _initLayout: function() {
        this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-layer-opacity');
        L.DomEvent.disableClickPropagation(this._container);
        L.DomEvent.disableScrollPropagation(this._container);

        // const icon = L.DomUtil.create('div','leaflet-layer-opacity-toggleimg');
        this._toggle = L.DomUtil.create('a','leaflet-layer-opacity-toggle leaflet-layer-opacity-toggleimg');
        this._content = L.DomUtil.create('div', 'leaflet-layer-opacity-content');

        this._container.appendChild(this._content);
        // this._toggle.appendChild(icon);
        this._container.appendChild(this._toggle);

        if (this.options.title) {
            const title = L.DomUtil.create('div','leaflet-layer-opacity-title');
            title.innerHTML = this.options.title;
            this._content.appendChild(title);
        }
        // Set expand event + initialization
        if (this.options.collapse) {
            this._collapse();
            L.DomEvent.on(this._container, {
                mouseenter: this._expand,
                mouseleave: this._collapse,
            }, this);
        } else {
            this._expand();
        }

        this._layerscontainer = L.DomUtil.create('div','leaflet-layer-opacity-sliders');
        this._content.appendChild(this._layerscontainer);

        // Update layers when map is changing
        if (this.options.layerOnMap) {
            this._map.on('layeradd', (event)=>{
                this._update();
            });
            this._map.on('layerremove', (event)=>{
                this._update();
            });
        }

        this._update();
    },

    /** Update the control content */
    _update: function () {

        if (this.options.layers) {
            let layer_container = L.DomUtil.create('div');
            if (this.options.layers instanceof Array) { // Array
                this.options.layers.forEach(layer => {
                    let layer_name = layer.options.attribution;
                    let slider_opacity = null;
                    if (this.options.layerOnMap) { // Only for the layers added on map
                        if (this._map.hasLayer(layer)) {
                            slider_opacity = this._getSlider(layer, layer_name);
                            layer_container.appendChild(slider_opacity);
                        }
                    } else {
                        slider_opacity = this._getSlider(layer, layer_name);
                        layer_container.appendChild(slider_opacity);
                    }
                });
            } else if (typeof this.options.layers == 'object') { // Object
                Object.keys(this.options.layers).forEach(layer_key => {
                    let layer = this.options.layers[layer_key];
                    let slider_opacity = null;
                    if (this.options.layerOnMap) { // Only for the layers added on map
                        if (this._map.hasLayer(layer)) {
                            slider_opacity = this._getSlider(layer, layer_key);
                            layer_container.appendChild(slider_opacity);
                        }
                    } else {
                        slider_opacity = this._getSlider(layer, layer_key);
                        layer_container.appendChild(slider_opacity);
                    }
                });
            }
            this._layerscontainer.replaceChildren(layer_container);

        } else {
            console.warn('No option.layers provided');
        }

        if (!this._container) {
            return this;
        }
    },

    /** create a slider */
    _getSlider: function(layer_value, layer_name) {
        let layer_opacity_percent = null;
        if (layer_value.options.opacity) {
            layer_opacity_percent = (layer_value.options.opacity*100).toFixed(0);
        } else if (typeof layer_value.options.style == 'function') {
            layer_opacity_percent = (layer_value.options.style().opacity*100).toFixed(0);
        } else if (typeof layer_value.getLayers == 'function') {
            let layers = layer_value.getLayers();
            layer_opacity_percent = (layers.lenght > 0) ? (layers[0].options.opacity*100).toFixed(0) : 100 ;
        }

        let layer_opacity = L.DomUtil.create('div');
        // layer name
        let layer_label = L.DomUtil.create('div', 'leaflet-layer-opacity-label');
        layer_label.innerHTML = layer_name;
        layer_opacity.appendChild(layer_label);

        let layer_slider_container = L.DomUtil.create('div', 'leaflet-layer-opacity-slider-container');
        // layer opacity slider
        let layer_slider = L.DomUtil.create('input', 'leaflet-layer-opacity-slider');
        layer_slider.setAttribute('type','range');
        layer_slider.setAttribute('min','0');
        layer_slider.setAttribute('max','100');
        layer_slider.setAttribute('step',this.options.step);
        layer_slider.setAttribute('value',layer_opacity_percent);
        layer_slider_container.appendChild(layer_slider);

        let layer_slider_output = L.DomUtil.create('output');
        layer_slider_output.innerText = `${layer_opacity_percent}%`;
        layer_slider_container.appendChild(layer_slider_output);

        layer_opacity.appendChild(layer_slider_container);
        // Event slider change value
        layer_slider.oninput = (event)=>{
            let slider_opacity_percent = event.target.value;
            layer_slider_output.innerText = `${slider_opacity_percent}%`;
            let opacity_value = slider_opacity_percent/100;
            if (typeof layer_value.setOpacity == 'function') { // Raster layer
                layer_value.setOpacity(opacity_value);
            } else if (typeof layer_value.setStyle == 'function') { // Path
                layer_value.setStyle({
                    opacity: opacity_value,
                });
            } else {
                console.error("This layer type is not supported by Leaflet.LayerOpacity: ",layer_value);
            }
        }
        return layer_opacity;
    },

    /** Expand the control */
    _expand: function () {
        this._content.style.display = null;
        this._toggle.style.display = 'none';
        return this;
    },

    /** Collapse the control */
    _collapse: function () {
        this._content.style.display = 'none';
        this._toggle.style.display = null;
        return this;
    },


});

/* The standard Leaflet plugin creation pattern is to implement a factory function that
 * enables the creation of the plugin to be chained with other function calls:
 * L.leafletLayerOpacity().addTo(map);
 * The common convention is to name the factory function after the class of the control
 * plugin but make the first letter lower case.
 */
L.leafletLayerOpacity = function (options) {
    return new L.LeafletLayerOpacity(options);
};
