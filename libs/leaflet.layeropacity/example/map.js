// Add your layers to the map
// CartoDB light_all
const CartoDB_light_all = L.tileLayer('https://{s}.basemaps.cartocdn.com/{style}/{z}/{x}/{y}.png', {
    style: 'light_all',
    attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
});
// OpenStreetMap
const OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19,
});
OpenStreetMap.setOpacity(0.2);

// FeatureGroup
const line1 = L.polyline([[50.613,3.0294],[50.613,3.089]], {
    color: 'red',
    opacity: 0.5,
});
const line2 = L.polyline([[50.609,3.0294],[50.609,3.089]], {
    color: 'red',
    opacity: 0.5,
});
const line3 = L.polyline([[50.604,3.0294],[50.604,3.089]], {
    color: 'red',
    opacity: 0.5,
});
const featureGroup = L.featureGroup([line1, line2, line3]);

// Polygon
const polygon = L.polygon([[50.658, 3.020],[50.670, 3.056],[50.652, 3.077]], {
    color: 'red',
    opacity: 1.0,
    fillColor: 'red',
    fillOpacity: 0.2,
});

// Define map
var map = L.map('map')
map.setView([50.635, 3.054], 13);

CartoDB_light_all.addTo(map);
OpenStreetMap.addTo(map);
polygon.addTo(map);
featureGroup.addTo(map);

// Define basemaps and overlays for the control
var baseMaps = {
    "CartoDB light_all": CartoDB_light_all
};
var overlayMaps = {
    "OpenStreetMap": OpenStreetMap,
    "Polygon": polygon,
    "FeatureGroup": featureGroup,
};
// Add the Layer Control to the map
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Define the Leaflet.LayerOpacity control
let leafletLayerOpacity = L.leafletLayerOpacity({
    position: 'topright',
    title: 'Layer Opacity',
    layerOnMap: true,
    collapse: true,
    step: 1,
    layers: overlayMaps,
    // layers: [CyclOSM, CyclOSM_lite], // Alternative
});
// Add control to map
leafletLayerOpacity.addTo(map);

map.on('click',(e)=>{
    console.log(e);
})