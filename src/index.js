// ESLint settings:
/* eslint no-unused-vars: 1 */
/* global mapConfig */

import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import 'ol/ol.css';
import 'ol-sld-styler/dist/ol-sld-styler.css';
import './default.css';

// Module to import OGC GeoPackages
// (import early to start async loading of required sql.js Web Assembly code)
import loadGpkg from 'ol-load-geopackage';

import {createAllLayers, styleLayers, checkForMissingData, insertLegend}
    from 'ol-sld-styler';

// Custom control: self-geolocation
import geolocateMe from './geolocateMe';

// OpenLayers 6 modules
import {get as ol_proj_get} from 'ol/proj';
import ol_Map from 'ol/Map';
import ol_View from 'ol/View';
import ol_layer_Tile from 'ol/layer/Tile';
import OSM from "ol/source/OSM";
import {defaults as ol_control_defaults} from 'ol/control';
import ol_control_Control from 'ol/control/Control';
import ol_control_ScaleLine from 'ol/control/ScaleLine';

// Proj4S (if additional coordinate projections required in OpenLayers)
import proj4 from 'proj4';
import {register as ol_proj_proj4_register} from 'ol/proj/proj4';

document.title = mapConfig.pageTitle;

// Make projections defined in proj4 available in OpenLayers.
// (must be done before GeoPackages are loaded)
// Define BNG Projection (parameters from https://epsg.io/27700)
proj4.defs("EPSG:27700","+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs");
ol_proj_proj4_register(proj4);

// Check if we need to add Proj4s definition for requested display projection
if (!ol_proj_get(mapConfig.displayProjection)) {
    fatalError("Missing requested display projection [" +
        mapConfig.displayProjection + "] - can be added with proj4.defs");
}

// Initiate load of OGC GeoPackage
const gpkgFile = mapConfig.gpkgFile;
const gpkgPromise = loadGpkg(gpkgFile, mapConfig.displayProjection);

// When all loaded (and data extracted) do all OpenLayers layer styling
const gpkgStyledPromise = gpkgPromise
    .then(([dataFromGpkg, sldsFromGpkg]) => {
        // Not loading any separate SLD files
        const sldsFromFiles = {};

        const sourceDescription = 'GeoPackage file: ' + gpkgFile;
        styleLayers(mapView, sourceDescription, dataFromGpkg,
            sldsFromGpkg, sldsFromFiles, mapConfig.sldStylerOptions);

        // For development: display helper template data for all tables
        // extracted from the OGC GeoPackage file
        if (mapConfig.debugShowTableJson) {
            debugShowTableJson(gpkgFile, dataFromGpkg);
        }
        // For development: display SLDs extracted from "layer_styles" table
        // in QGIS-exported OGC GeoPackage file
        if (mapConfig.debugShowSLD) {
            console.log('DEBUG: Raw SLD XML for each layer in' +
                ' GeoPackage "' + gpkgFile + '":');
            console.log(sldsFromGpkg);
        }
    })
    // Flag fatal error to user
    // (but code will actually limp on with missing layers marked)
    .catch(error => fatalError(error));

// Ordered list of OpenLayers data layers/groups
var dataLayerList;

// Layers for which click-selection is enabled (not used in this example)
var selectableLayers;

// Parse data layer definitions and create placeholder layers which will be
// updated when actual data has been loaded
try {
    [dataLayerList, selectableLayers] = createAllLayers(
        mapConfig.dataLayersConfig);
} catch (error) {
    fatalError("Problem with mapConfig.dataLayersConfig:\n" + error);
}

// Define a base layer raster map
const lyrOpenStreetMap = new ol_layer_Tile({
    title: 'Open Street Map',
    properties: {'type': 'base' },
    opacity: 0.5,
    source: new OSM()
});

// Create Map canvas and View
const map = new ol_Map({
    target: 'map',
    renderer: 'canvas',
    controls: ol_control_defaults({
        attributionOptions: {
            collapsed: false,
            collapsible: true
        }
    }).extend([
        new ol_control_ScaleLine()
    ]),
    layers: [lyrOpenStreetMap].concat(dataLayerList),
    view: new ol_View({
        projection: mapConfig.displayProjection,
        maxZoom: 28,
        minZoom: 1
    })
});
const mapView = map.getView();
mapView.fit(mapConfig.initialMapExtent, map.getSize());

const geolocateControl = geolocateMe(map, mapConfig.displayProjection);
map.addControl(geolocateControl);

// Final checks and build legend after all GeoPackages loaded and associated
// layers styled
gpkgStyledPromise
    .then(() => {
        // Any tables defined in mapConfig.dataLayersConfig still missing?
        checkForMissingData();

        // Build legend
        if (mapConfig.sldStylerOptions.showLegend) {
            buildLegendBox();
        }
    })
    .catch(error => fatalError(error));

/**
 * Example OpenLayers toggle control to show/hide Legend box
 */
 class legendToggleControl extends ol_control_Control {
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
        const options = opt_options || {};

        const button = document.createElement('button');
        button.title = 'Map Key show/hide';
        button.className += ' fa fa-list-alt';

        const element = document.createElement('div');
        element.className = 'legend-toggle ol-unselectable ol-control';
        element.appendChild(button);

        super({
            element: element,
            target: options.target,
        });

        button.addEventListener('click', this.toggleLegend.bind(this), false);
    }

    // Button click handler (turns Legend on/off)
    toggleLegend() {
        const legend = document.getElementsByClassName('legend-box')[0];
        legend.classList.toggle('switched-off');
    }
}
map.addControl(new legendToggleControl);

//-----------------------------------------------------------------------------
// Function definitions only from here
//-----------------------------------------------------------------------------

/**
 * Basic example of building fixed holder for map legend
 */
 function buildLegendBox() {
    const legendBox = document.createElement('div');
    legendBox.className = "legend-box ol-control";

    const legendTitle = document.createElement('div');
    legendTitle.className = "legend-title";
    legendTitle.innerHTML = "MRCO Orchard Map Key";
    legendBox.appendChild(legendTitle);

    const controlsContainer = map.getControls().getArray()[0].element.parentNode;
    controlsContainer.appendChild(legendBox);

    // sldStyler insertLegend: construct legend and add to end of legendBox
    insertLegend(map, legendBox);
}

/**
 * For development: display helper template data for all tables in GeoPackage
 * @param {string} gpkgFile - URL of loaded OGC GeoPackage
 * @param {object} dataFromGpkg - OpenLayers vector sources, key = table name
 */
 function debugShowTableJson(gpkgFile, dataFromGpkg) {
    var debugTables =
        'DEBUG: Feature tables as JSON template for dataLayersConfig array' +
        ' (in mapConfig) as extracted from "' +
        gpkgFile + '":\n';
    for (const table in dataFromGpkg) {
        // Template data for each table + its properties (except geometry)
        const properties = dataFromGpkg[table].getFeatures()[0]
            .getProperties();
        delete properties.geometry;
        debugTables +="{\n" +
            "\ttable: '" + table + "',\n" +
            "\tpopupAttr: [" +
            Object.keys(properties).map(p => `['${p}']`).join(', ') +
            "]\n" +
            "},\n";

    }
    console.log(debugTables);
}

/**
 * Inform user of fatal error then stop everything
 * @param {string} message - error message to display
 */
function fatalError(message) {
    console.error('FATAL error: ' + message);
    alert('FATAL error: ' + message);
    throw 'FATAL error: ' + message;
}
