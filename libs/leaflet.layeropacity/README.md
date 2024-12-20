# Leaflet.LayerOpacity

Leaflet.LayerOpacity is a Leaflet plugin that provides a control for adjusting the opacity of map layers.

## Features

- Easily control the opacity of multiple map layers.
- Support for both TileLayers and ImageOverlays.
- Slider interface for adjusting layer opacity.
- Option to collapse/expand the control.

## Demo
[View Demo](#)

## Getting Started

### Prerequisites

Make sure you have Leaflet library included in your project.

This plugin is compatible with Leaflet version 1.x.x .

### Installation

Include the `Leaflet.LayerOpacity.js` and `Leaflet.LayerOpacity.css` files in your project.

```html
<link rel="stylesheet" href="path/to/Leaflet.LayerOpacity.css">
<script src="path/to/Leaflet.LayerOpacity.js"></script>
```

### Usage
Create a map:
```javascript
var map = L.map('map').setView([39.73, -104.99], 10);

// Add your layers to the map
var streets = L.tileLayer(...);
var satellite = L.tileLayer(...);
var cities = L.tileLayer(...);
var rivers = L.tileLayer(...);
var forests = L.tileLayer(...);

// Define basemaps and overlays for the control
var baseMaps = {
    "Streets": streets,
    "Satellite": satellite
};
var overlayMaps = {
    "Cities": cities,
    "Rivers": rivers,
    "Forests": forests
};
// Add the Layer Control to the map
L.control.layers(baseMaps, overlayMaps).addTo(map);
```
Add the Leaflet.LayerOpacity control:
```javascript
// Define the Leaflet.LayerOpacity control
let leafletLayerOpacity = L.leafletLayerOpacity({
    position: 'topright', // Control position
    title: 'Layer Opacity', // Control title
    layerOnMap: true, // Only display layers if on map
    collapse: true, // Should the control be able to collapse or always be open
    step: 1, // Slider opacity steps
    layers: overlayMaps, // Layers objects
    // layers: [cities, rivers, forests], // OR Layers array
});
// Add control to map
leafletLayerOpacity.addTo(map);
```

| Option       | Description                                         | Default Value   | Type            |
|--------------|-----------------------------------------------------|-----------------|-----------------|
| position     | Control position on the map                         | 'topright'      | string          |
| title        | Control title displayed on the UI                   | 'Layer Opacity' | string          |
| layerOnMap   | Display layers only if they are on the map          | true            | boolean         |
| collapse     | Enable collapsing/expanding feature for the control | true            | boolean         |
| step         | Opacity slider steps                                | 1               | number          |
| layers       | Layers objects or array to control opacity for      | null            | object or array |


Option `layers` accept array of layers.<br>
If you use an object you can specify the labels for your layers.<br>
If you use an array, the layers attributions will be used as layers labels.