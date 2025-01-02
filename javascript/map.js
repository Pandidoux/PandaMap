window.app = {};

app.map = L.map('mapdiv',{
    center: [46.8, 2.02],
    zoom: 6,
    minZoom: 3,
    zoomControl: false,
}); // Map


// ========== Layers START ==========
// Regions (FR)
getLargeWfs(app.map, RegionsFR, 'https://data.geopf.fr/wfs/ows', {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typenames: 'BDCARTO_V5:region',
    srsname: 'EPSG:4326',
    outputformat: 'application/json',
}, 'GET');
// Departements (FR)
getLargeWfs(app.map, DepartementsFR, 'https://data.geopf.fr/wfs/ows', {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typenames: 'BDCARTO_V5:departement',
    srsname: 'EPSG:4326',
    outputformat: 'application/json',
}, 'GET');
// Communes (FR)
getLargeWfs(app.map, CommunesFR, 'https://data.geopf.fr/wfs/ows', {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typenames: 'BDCARTO_V5:commune',
    srsname: 'EPSG:4326',
    outputformat: 'application/json',
}, 'GET');
// Parcelles (FR)
getLargeWfs(app.map, ParcellesFR, 'https://data.geopf.fr/wfs/ows', {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typenames: 'CADASTRALPARCELS.PARCELLAIRE_EXPRESS:parcelle',
    srsname: 'EPSG:4326',
    outputformat: 'application/json',
}, 'GET');
// Batiments (FR)
// getLargeWfs(app.map, BatimentsFR, 'https://data.geopf.fr/wfs/ows', {
//     service: 'WFS',
//     version: '2.0.0',
//     request: 'GetFeature',
//     typenames: 'BDCARTO_V5:troncon_de_route',
//     srsname: 'EPSG:4326',
//     outputformat: 'application/json',
// }, 'GET');
// Routes (FR)
// getLargeWfs(app.map, RoutesFR, 'https://data.geopf.fr/wfs/ows', {
//     service: 'WFS',
//     version: '2.0.0',
//     request: 'GetFeature',
//     typenames: 'BDCARTO_V5:troncon_de_route',
//     srsname: 'EPSG:4326',
//     outputformat: 'application/json',
// }, 'GET');

// ========== Layers END ==========


// ========== Formatage de la carte START ==========
// app.map.addLayer(OpenStreetMap);
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { // dark mode
    app.map.addLayer(CartoDB_dark_all);
} else {
    app.map.addLayer(CartoDB_lightall);
}

// Zoom event
// app.map.on('zoom', (e) => {
//     console.log('zoom =', e.target._zoom);
// });
// ========== Formatage de la carte END ==========


// ========== Layer control START ==========
var baseLayers = {
    "OpenStreetMap (OSM)": OpenStreetMap,
    "OpenStreetMap (FR)": OpenStreetMapFR,
    "OSM Humanitarian": OSMHumanitarian,
    "Plan IGN": PlanIGN,
    "CartoDB Clair": CartoDB_lightall,
    "CartoDB Sombre": CartoDB_dark_all,
    "CartoDB Voyager": CartoDB_rastertiles_voyager,
    "Vélo": CyclOSM,
    "Photo aeriennes (FR)": orthophoto_ign,
    "Satellite 2023 (FR)": SatelliteSPOT2023,
    "Satellite": Stadia_AlidadeSatellite,
};
var overlays = {
    "Piste Vélo": CyclOSM_lite,
    "Regions (FR)": RegionsFR,
    "Départements (FR)": DepartementsFR,
    "Communes (FR)": CommunesFR,
    "Parcelles (FR)": ParcellesFR,
    // "Batiments (FR)": BatimentsFR,
    // "Routes (FR)": RoutesFR,
    "Restrictions drones (FR)": RestrictionsDrones_IGN,
};
var controlLayer = L.control.layers(baseLayers, overlays, {
    position: 'topright',
    // position: 'bottomleft',
    // position: (window.isMobileDevice) ? 'bottomright' : 'bottomleft',
}).addTo(app.map);
if (!isMobileDevice) {
    controlLayer.expand();
}
// ========== Layer control END ==========


// ========== Zoom control START ==========
let zoomControl = L.control.zoom({
    position: 'topright',
    zoomInTitle: 'Zoomer',
    zoomOutTitle: 'Dézoomer',
});
zoomControl.addTo(app.map);
// ========== Zoom control END ==========


// ========== Fullscreen Control START ==========
if (typeof L.control.fullscreen == 'function') {
    // create a fullscreen button and add it to the map
    L.control.fullscreen({
        position: 'topright', // change the position of the button can be topleft, topright, bottomright or bottomleft, default topleft
        // title: 'Mode plein écran', // change the title of the button, default Full Screen
        title: {
            'false': 'Mode plein écran',
            'true': 'Quitter plein écran'
        },
        titleCancel: 'Quitter plein écran', // change the title of the button when fullscreen is on, default Exit Full Screen
        content: null, // change the content of the button, can be HTML, default null
        forceSeparateButton: false, // force separate button to detach from zoom buttons, default false
        forcePseudoFullscreen: false, // force use of pseudo full screen even if full screen API is available, default false
        fullscreenElement: false // Dom element to render in full screen, false by default, fallback to map._container
    }).addTo(app.map);
}
// ========== Fullscreen Control STOP ==========


// ========== Leaflet-LocateControl START ==========
L.control.locate({
    position: 'topright',
    flyTo: true,
    showCompass: true,
    drawCircle: true,
    drawMarker: true,
    metric: true,
    showPopup: true,
    strings: {
        title: "Montrez moi ma position",
        metersUnit: "metres",
        feetUnit: "pieds",
        popup: "Vous êtes dans les {distance} {unit} autour de ce point",
        outsideMapBoundsMsg: "Vous semblez localisé en dehors des bordures de carte"
    },
}).addTo(app.map);
// ========== Leaflet-LocateControl STOP ==========


// ========== Scale control START ==========
L.control.scale({
    position: (window.isMobileDevice) ? 'bottomright' : 'bottomleft',
    maxWidth: 100,
    metric: true,
    imperial: false,
    updateWhenIdle: false,
}).addTo(app.map);
// ========== Scale control END ==========


// ========== Ajoute la recherche du plugin Leaflet Geosearch START ==========
if (typeof GeoSearch == 'object') {
    // Création du provider https://smeijer.github.io/leaflet-geosearch/providers/openstreetmap
    const geosearch_provider = new GeoSearch.OpenStreetMapProvider({ // OpenStreetMap Nominatim https://nominatim.org/release-docs/develop/api/Overview/
        params: {
            'accept-language': 'fr',
            countrycodes: 'fr',
            limit: 5,
            // viewbox: '2.757568,50.803331,3.313064,50.492463',
            // bounded: 1,
        },
    });
    // Créer un nouveau control GeoSearchControl qui doit utiliser les geosearch_options
    var geosearch_control = new GeoSearch.GeoSearchControl({
        provider: geosearch_provider,
        style: (isMobileDevice) ? 'button' : 'bar',
        position: 'topright',
        showMarker: true,
        showPopup: true,
        searchLabel: "Rechercher une adresse",
        notFoundMessage: "Adresse introuvable",
        animateZoom: true,
        zoomLevel: 18,
        autoComplete: true,
        autoCompleteDelay: 700,
        autoClose: true,
        keepResult: true,
    });
    // Ajoute le control geosearch_control dans notre carte
    app.map.addControl(geosearch_control);
}
// ========== Ajoute la recherche du plugin Leaflet Geosearch END ==========


// ========== Leaflet.PanoramaxViewer control START ==========
// Define the Leaflet.PanoramaxViewer control
let leafletPanoramaxViewer = L.leafletPanoramaxViewer({
    api: 'https://api.panoramax.xyz/api',
    // id: 'panoramax-psv-id',
    control: true,
    controlLabel: 'Permuter Panoramax',
    position: 'topleft',
    collapsed: true,
    searchRadius: 30,
    width: '250px',
    height: '250px',
    clickToMove: true,
    dragAndDrop: true,
    resizable: true,
    resizableLabel: 'Taille par défaut',
    photoLocationButton: true,
    photoLocationLimit: 20000,
    photoLocationLabel: 'Localisation photos',
    photoLocationEnabled: true,
    photoLocationMinZoom: 17,
});
// Add control to map
leafletPanoramaxViewer.addTo(app.map);
// ========== Leaflet.PanoramaxViewer control END ==========


// ========== GpPluginLeaflet Route control START ==========
const route_control = L.geoportalControl.Route({
    position: 'topleft',
}).addTo(app.map);
// ========== GpPluginLeaflet Route control END ==========

// ========== GpPluginLeaflet MousePosition control START ==========
const mousePosition_control = L.geoportalControl.MousePosition({
    position: 'topleft',
}).addTo(app.map);
// ========== GpPluginLeaflet MousePosition control END ==========

// ========== GpPluginLeaflet ReverseGeocode control START ==========
const reverseGeocode_control = L.geoportalControl.ReverseGeocode({
    position: 'topleft',
}).addTo(app.map);
// ========== GpPluginLeaflet ReverseGeocode control END ==========

// ========== GpPluginLeaflet Isocurve control START ==========
const isocurve_control = L.geoportalControl.Isocurve({
    position: 'topleft',
}).addTo(app.map);
// ========== GpPluginLeaflet Isocurve control END ==========

// ========== GpPluginLeaflet ElevationPath control START ==========
const elevationPath_control = L.geoportalControl.ElevationPath({
    apiKey: 'altimetrie',
    position: 'topleft',
    ssl: true,
    active: false,
    stylesOptions: {},
}).addTo(app.map);
// ========== GpPluginLeaflet ElevationPath control END ==========

// -5.6689453125,41.82045509614034,9.711914062500002,51.37178037591739
app.map.on('moveend', (e) => {
    const boundsFR = L.latLngBounds(L.latLng(41.820, -5.668), L.latLng(51.371, 9.711));
    const mapBounds = e.target.getBounds();
    const GpPluginLeaflet_visibility = (mapBounds.intersects(boundsFR)) ? null : 'none' ;
    document.querySelectorAll('.GPwidget').forEach(GpPluginLeaflet_control => {
        GpPluginLeaflet_control.style.display = GpPluginLeaflet_visibility;
    });
});


// ORTHOIMAGERY_ORTHOPHOTOS = L.geoportalLayer.WMTS({
//     layer : "ORTHOIMAGERY.ORTHOPHOTOS"
// });


// ========== Leaflet.LayerOpacity control START ==========
let leafletLayerOpacity = L.leafletLayerOpacity({
    position: 'topright', // Control position
    title: 'Opacité des couches', // Control title
    layerOnMap: true, // Only display layers if on map
    collapse: true, // Should the control be able to collapse or always be open
    step: 1, // Slider opacity steps
    layers: overlays, // Layers objects
});
// Add control to map
leafletLayerOpacity.addTo(app.map);
// ========== Leaflet.LayerOpacity control END ==========


// ========== Leaflet-Measure Control START ==========
// https://github.com/ptma/Leaflet.Measure
if (typeof L.Measure == 'object' && typeof L.control.measure == 'function') {
    // Redéfinit les textes en francais
    L.Measure = {
        linearMeasurement: "Distance",
        areaMeasurement: "Surface",
        start: "Début",
        meter: "m",
        meterDecimals: 0,
        kilometer: "km",
        kilometerDecimals: 2,
        squareMeter: "m²",
        squareMeterDecimals: 0,
        squareKilometers: "km²",
        squareKilometersDecimals: 2
    };
    let measureControl = L.control.measure({
        position: 'topright', // The position of the control.
        title: 'Outils de mesure', // The title of the control.
        collapsed: true, // If true, the control will be collapsed into an icon and expanded on mouse hover or touch.
        color: '#FF0080', // The color of the lines or polygons.
    });
    measureControl.addTo(app.map);
}
// ========== Leaflet-Measure Control END ==========
