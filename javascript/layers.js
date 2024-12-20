// ========== Définitions des couches des cartes START ==========



// ========== Baselayers ==========


// OpenStreetMap
const OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19,
    edgeBufferTiles: 1.5,
});


// OpenStreetMap FR (https://wiki.openstreetmap.org/wiki/FR:Serveurs/tile.openstreetmap.fr)
const OpenStreetMapFR = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 20,
});


// OSM Humanitarian
const OSMHumanitarian = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors. Tiles courtesy of <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
    maxZoom: 20
});


// PLanIGN
const PlanIGN  = L.tileLayer.wms('https://data.geopf.fr/wms-r/', {
    attribution: 'Plan IGN <a href="https://geoservices.ign.fr/" target="_blank">© IGN</a>',
    layers: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
    format: 'image/jpeg',
    version: '1.3.0',
    service: 'WMS',
    edgeBufferTiles: 1.5,
});


// CartoDB lightall
const CartoDB_lightall = L.tileLayer('https://{s}.basemaps.cartocdn.com/{style}/{z}/{x}/{y}'+(L.Browser.retina?'@2x.png':'.png'), {
    attribution:'<a href="http://www.openstreetmap.org/copyright">© OpenStreetMap</a>, <a href="https://carto.com/attributions">© CARTO</a>',
    style: 'light_all',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0,
    edgeBufferTiles: 1.5,
});


// CartoDB dark_all
const CartoDB_dark_all = L.tileLayer('https://{s}.basemaps.cartocdn.com/{style}/{z}/{x}/{y}'+(L.Browser.retina?'@2x.png':'.png'), {
    style: 'dark_all',
    attribution: '<a href="http://www.openstreetmap.org/copyright">© OpenStreetMap</a>, <a href="https://carto.com/attributions">© CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
});


// CartoDB rastertiles_voyager
const CartoDB_rastertiles_voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/{style}/{z}/{x}/{y}'+(L.Browser.retina?'@2x.png':'.png'), {
    style: 'rastertiles/voyager',
    attribution: '<a href="http://www.openstreetmap.org/copyright">© OpenStreetMap</a>, <a href="https://carto.com/attributions">© CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
});


// CyclOSM (https://wiki.openstreetmap.org/wiki/Raster_tile_providers)
const CyclOSM = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
    subdomains: 'abc',
    format: 'image/png',
    version: '1.1.1',
    srs: 'EPSG:3857',
    transparent: false,
    maxZoom: 20,
});


// Orthophoto IGN
const orthophoto_ign = L.tileLayer.wms('https://data.geopf.fr/wms-r', {
    service: 'WMS',
    request: 'GetMap',
    version: '1.3.0',
    layers: 'HR.ORTHOIMAGERY.ORTHOPHOTOS',
    format: 'image/png',
    attribution: '© <a href="https://geoservices.ign.fr/" target="_blank">IGN</a> Photographies aeriennes ',
});


// Satellite SPOT 2023
const SatelliteSPOT2023 = L.tileLayer.wms('https://data.geopf.fr/wms-r', {
    service: 'WMS',
    request: 'GetMap',
    version: '1.3.0',
    layers: 'ORTHOIMAGERY.ORTHO-SAT.SPOT.2023',
    format: 'image/png',
    attribution: '© <a href="https://geoservices.ign.fr/" target="_blank">IGN</a> Photos Satellite SPOT 2023',
});


// Satellite (Monde)
const Stadia_AlidadeSatellite = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg',
});


// ========== Overlays ==========


// CyclOSM Lite (https://wiki.openstreetmap.org/wiki/Raster_tile_providers)
const CyclOSM_lite = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm-lite/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
    subdomains: 'abc',
    format: 'image/png',
    version: '1.1.1',
    srs: 'EPSG:3857',
    transparent: true,
    minZoom: 11,
    maxZoom: 20,
});



// https://geoservices.ign.fr/services-geoplateforme-diffusion#nomstechniques

// Restrictions drones de loisir
const RestrictionsDrones_IGN = L.tileLayer.wms('https://data.geopf.fr/wms-r', {
    attribution: '© <a href="https://geoservices.ign.fr/" target="_blank">IGN</a> Restrictions pour drones de loisir',
    service: 'WMS',
    request: 'GetMap',
    version: '1.3.0',
    layers: 'TRANSPORTS.DRONES.RESTRICTIONS',
    format: 'image/png',
    maxZoom: 18,
});


// Département (FR)
const RegionsFR = L.geoJSON(null, {
    minZoom: 0,
    attribution: '© <a href="https://geoservices.ign.fr/" target="_blank">IGN</a> BDCARTO_V5:region',
    style: function (feature) {
        return {
            stroke: true,
            color: "#f00",
            weight: 1.0,
            opacity: 1.0,
            fill: true,
            fillColor: '#f00',
            fillOpacity: 0.1,
            interactive: true,
            bubblingMouseEvents: false,
        };
    },
    onEachFeature: function (feature, layer) {
        let content = '';
        Object.keys(feature.properties).forEach(key => {
            content += `<b>${key} :</b> ${feature.properties[key]}<br>`;
        });
        layer.bindPopup(
            L.popup({
                content: content,
                sticky: true,
            })
        );
    },
});


// Département (FR)
const DepartementsFR = L.geoJSON(null, {
    minZoom: 0,
    attribution: '© <a href="https://geoservices.ign.fr/" target="_blank">IGN</a> BDCARTO_V5:departement',
    style: function (feature) {
        return {
            stroke: true,
            color: "#f00",
            weight: 1.0,
            opacity: 1.0,
            fill: true,
            fillColor: '#f00',
            fillOpacity: 0.1,
            interactive: true,
            bubblingMouseEvents: false,
        };
    },
    onEachFeature: function (feature, layer) {
        let content = '';
        Object.keys(feature.properties).forEach(key => {
            content += `<b>${key} :</b> ${feature.properties[key]}<br>`;
        });
        layer.bindPopup(
            L.popup({
                content: content,
                sticky: true,
            })
        );
    },
});


// Communes (FR)
const CommunesFR = L.geoJSON(null, {
    minZoom: 9,
    attribution: '© <a href="https://geoservices.ign.fr/" target="_blank">IGN</a> BDCARTO_V5:commune',
    style: function (feature) {
        return {
            stroke: true,
            color: "#f00",
            weight: 1.0,
            opacity: 1.0,
            fill: true,
            fillColor: '#f00',
            fillOpacity: 0.1,
            interactive: true,
            bubblingMouseEvents: false,
        };
    },
    onEachFeature: function (feature, layer) {
        let content = '';
        Object.keys(feature.properties).forEach(key => {
            content += `<b>${key} :</b> ${feature.properties[key]}<br>`;
        });
        layer.bindPopup(
            L.popup({
                content: content,
                sticky: true,
            })
        );
    },
});


// Parcelles (FR)
const ParcellesFR = L.geoJSON(null, {
    minZoom: 16,
    attribution: '© <a href="https://geoservices.ign.fr/" target="_blank">IGN</a> CADASTRALPARCELS.PARCELLAIRE_EXPRESS:parcelle',
    style: function (feature) {
        return {
            stroke: true,
            color: "#f00",
            weight: 1.0,
            opacity: 1.0,
            fill: true,
            fillColor: '#f00',
            fillOpacity: 0.1,
            interactive: true,
            bubblingMouseEvents: false,
        };
    },
    onEachFeature: function (feature, layer) {
        let content = '';
        Object.keys(feature.properties).forEach(key => {
            content += `<b>${key} :</b> ${feature.properties[key]}<br>`;
        });
        layer.bindPopup(
            L.popup({
                content: content,
                sticky: true,
            })
        );
    },
});


// Batiments (FR)
// const BatimentsFR = L.geoJSON(null, {
//     minZoom: 16,
//     attribution: '© <a href="https://geoservices.ign.fr/" target="_blank">IGN</a> ???????????????????',
//     style: function (feature) {
//         return {
//             stroke: true,
//             color: "#f00",
//             weight: 1.0,
//             opacity: 1.0,
//             fill: true,
//             fillColor: '#f00',
//             fillOpacity: 0.1,
//             interactive: true,
//             bubblingMouseEvents: false,
//         };
//     },
//     onEachFeature: function (feature, layer) {
//         let content = '';
//         Object.keys(feature.properties).forEach(key => {
//             content += `<b>${key} :</b> ${feature.properties[key]}<br>`;
//         });
//         layer.bindPopup(
//             L.popup({
//                 content: content,
//                 sticky: true,
//             })
//         );
//     },
// });


// Routes (FR)
// const RoutesFR = L.geoJSON(null, {
//     minZoom: 16,
//     attribution: '© <a href="https://geoservices.ign.fr/" target="_blank">IGN</a> BDCARTO_V5:troncon_de_route',
//     style: function (feature) {
//         return {
//             stroke: true,
//             color: "#f00",
//             weight: 1.0,
//             opacity: 1.0,
//             fill: true,
//             fillColor: '#f00',
//             fillOpacity: 0.1,
//             interactive: true,
//             bubblingMouseEvents: false,
//         };
//     },
//     onEachFeature: function (feature, layer) {
//         let content = '';
//         Object.keys(feature.properties).forEach(key => {
//             content += `<b>${key} :</b> ${feature.properties[key]}<br>`;
//         });
//         layer.bindPopup(
//             L.popup({
//                 content: content,
//                 sticky: true,
//             })
//         );
//     },
// });
// ========== Définitions des couches des cartes END ==========