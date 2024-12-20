# Leaflet.PanoramaxViewer

Leaflet.PanoramaxViewer Short description

## Demo
[View Demo]()

## Getting Started

### Prerequisites

Make sure you have Leaflet library included in your project.

<!-- This plugin is compatible with Leaflet version 1.x.x . -->

### Installation

Include the `Leaflet.PanoramaxViewer.js` and `Leaflet.PanoramaxViewer.css` files in your project.

```html
<link rel="stylesheet" href="path/to/Leaflet.PanoramaxViewer.css">
<script src="path/to/Leaflet.PanoramaxViewer.js"></script>
```

### Usage
Create a map:
```javascript
var map = L.map('map').setView([39.73, -104.99], 10);

// Add the Control to the map
L.control.layers(baseMaps, overlayMaps).addTo(map);
```
Add the Leaflet.PanoramaxViewer control:
```javascript
// Define the Leaflet.PanoramaxViewer control
let leafletPanoramaxViewer = L.leafletPanoramaxViewer({
    api: 'https://api.panoramax.xyz/api',
    id: 'panoramax-psv-id',
    control: true,
    controlLabel: 'Toggle Panoramax',
    position: 'topleft',
    collapsed: false,
    searchRadius: 50,
    width: '400px',
    height: '400px',
    clickToMove: true,
    dragAndDrop: true,
    resizable: true,
    resizableLabel: 'Reset size',
    photoLocationButton: true,
    photoLocationLimit: 10000,
    photoLocationLabel: 'Photo locations',
    photoLocationEnabled: false,
    photoLocationMinZoom: 18,
});
// Add control to map
leafletPanoramaxViewer.addTo(map);
```

### Options

| Option               | Description                                           | Default Value      | Type    |
|----------------------|-------------------------------------------------------|--------------------|---------|
| api                  | Panoramax API instance [other instances](https://api.panoramax.xyz/api/instances) | [api.panoramax.xyz](https://api.panoramax.xyz/api) | string  |
| id                   | ID of the panoramax viewer                            | default            | string  |
| control              | Show a control button                                 | true               | boolean |
| controlLabel         | Label of the Panoramax viewer control button          | "Toggle Panoramax" | string  |
| position             | Control button position                               | topleft            | string  |
| collapsed            | Should Panoramax viewer be collapsed on init          | false              | boolean |
| searchRadius         | Size of the search radius around the marker placement | 20                 | number  |
| width                | Width of the panoramax viewer                         | 400px              | string  |
| height               | Height of the panoramax viewer                        | 400px              | string  |
| resizable            | Panoramax viewer can be resized *(1)                  | true               | boolean |
| resizableLabel       | Label of the reset size button                        | "Reset size"       | string  |
| clickToMove          | Enable click on map to move the cursor position       | true               | boolean |
| dragAndDrop          | Enable drag and drop to move the cursor position      | true               | boolean |
| photoLocationButton  | Display photo location toggle button                  | true               | boolean |
| photoLocationLimit   | Limit of photo locations to grab                      | 10000              | number  |
| photoLocationLabel   | Label of the photo locations button                  | "Photo locations"  | string  |
| photoLocationEnabled | Show photo locations on map init                      | false              | boolean |
| photoLocationMinZoom | Minimum zoom to display photos locations 0 -> 20      | 18                 | number  |

(1) Resize doesn't work well with every positions values.  
Some resize axis are disabled for some positions values :
- `topleft`: vertical + horizontal
- `topright`: vertical
- `bottomleft`: horizontal
- `bottomright`: both disabled

### Functions

| Name             | Description           | Param      |
|------------------|-----------------------|------------|
| setLocation      | Set marker location   | L.LatLng   |
| open             | Open viewer window    |            |
| close            | Close viewer window   |            |
