// OpenStreetMap layer
const OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19,
});


// Map definition
var map = L.map('map', {
    center: [50.635, 3.054],
    zoom: 18,
});
map.on('contextmenu',(e)=>{
    console.log(e);
})
OpenStreetMap.addTo(map);


// Define the Leaflet.LayerOpacity control
let leafletPanoramaxViewer = L.leafletPanoramaxViewer({
    api: 'https://api.panoramax.xyz/api', // Other instances https://api.panoramax.xyz/api/instances
    // id: 'panoramax-psv-id',
    control: true,
    // controlLabel: 'Toggle Panoramax',
    position: 'topleft',
    collapsed: false,
    panoramaxSearchRadius: 50,
    // width: '100vw',
    // height: '100vh',
    // resizable: false,
    // resizableLabel: 'Reset size',
    // clickToMove: false,
    // dragAndDrop: false,
    // photoLocationButton: false,
    // photoLocationEnabled: true,
    // photoLocationLimit: 25000,
    photoLocationMinZoom: 17,
    // photoLocationLabel: 'Toggle photos locations',
});

leafletPanoramaxViewer.addTo(map); // Add control to map
// console.log('leafletPanoramaxViewer =', leafletPanoramaxViewer);

map.zoomControl.addTo(map);