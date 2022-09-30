// ol-sld-styler Map Configuration: orchard sitemap
// All styling/data-specific settings can reside here
// - changes to this file do not require a Webpack rebuild

/* eslint no-unused-vars: 0 */

var mapConfig = {
    pageTitle: 'MRCO Orchard Map',

    // Vector data layers (+ styles) imported from QGIS in OGC GeoPackage format.
    // (Generated directly in QGIS using Processing > Package Layers)
    gpkgFile: 'mrco_site_interactive.gpkg',

    // Map View Projection
    displayProjection: 'EPSG:3857',

    // Initial map view [xmin, ymin, xmax, ymax]
    initialMapExtent: [-289905, 6705775, -289822, 6705880],

    // (Optional) DEBUG: Display (in console) dataLayersConfig template data
    // for this file, i.e. all tables in the GeoPackage
    //debugShowTableJson: true,

    // (Optional) DEBUG: display (in console) raw SLD for all layer_style tables
    //debugShowSLD: true,

    // Order, grouping and configuration of data layers
    dataLayersConfig: [
        {
            table: 'Zone labels',
            popupAttr: [['fid'], ['label'], ['type'], ['notes']]
        },
        {
            table: 'Other plants',
            popupAttr: [['fid'], ['type'], ['label'], ['accuracy'], ['notes']]
        },
        {
            table: 'Other trees or shrubs',
            popupAttr: [['fid'], ['type'], ['code'], ['accuracy'], ['notes']]
        },
        {
            table: 'Pre-hedgelaying other trees',
            popupAttr: [['fid'], ['type'], ['code'], ['accuracy'], ['notes']]
        },
        {
            table: 'Steps',
            popupAttr: [['fid'], ['condition'], ['notes'], ['step_id']]
        },
        {
            table: 'Fruit trees',
            popupAttr: [['fid'], ['code'], ['type'], ['variety'], ['accuracy'], ['notes'], ['var_label'], ['rhs_link'], ['auxiliary_storage_labeling_positionx'], ['auxiliary_storage_labeling_positiony']]
        },
        {
            table: 'Soft fruits',
            popupAttr: [['fid'], ['type'], ['label'], ['accuracy']]
        },
         {
            table: 'Infrastructure',
            popupAttr: [['fid'], ['type'], ['label'], ['notes'], ['auxiliary_storage_labeling_positionx'], ['auxiliary_storage_labeling_positiony']]
        },
        {
            table: 'Barriers',
            popupAttr: [['fid'], ['type'], ['notes']]
        },
        {
            table: 'Water features',
            popupAttr: [['fid'], ['type'], ['label'], ['notes']]
        },
        {
            table: 'Footpaths',
            popupAttr: [['fid'], ['path_id'], ['quality'], ['width_m'], ['notes']]
        },
        {
            table: 'Area type',
            popupAttr: [['fid'], ['notes'], ['type'], ['label']]
        },
        {
            table: 'Allotment sites',
            popupAttr: [['fid'], ['OBJECTID'], ['ASSET_ID'], ['SITE_NAME'], ['FEATURE_ID'], ['LOCATION'], ['PRIM_MEAS'], ['UNIT'], ['SITE_CODE'], ['NOTES'], ['SHAPE_AREA'], ['SHAPE_LEN']]
        },
        {
            table: 'Allotment plots',
            //visible: false,
            popupAttr: [['fid'], ['OBJECTID'], ['ASSET_ID'], ['SITE_NAME'], ['PLOT_NO'], ['FEATURE_ID'], ['LOCATION'], ['TYPE'], ['PRIM_MEAS'], ['UNIT'], ['SITE_CODE'], ['FEATURE_GP'], ['NEW_COLONY'], ['ASSOCIATIO'], ['TERTIARY_M'], ['TERTIARY_U'], ['X'], ['Y'], ['LETTINGS_I'], ['LETTINGS_1'], ['SITENAME'], ['PLOTNUMBER'], ['PLOTSIZE'], ['CURRENTSTA'], ['CUSTOMER'], ['SHAPE_AREA'], ['SHAPE_LEN']]
        },
   ],

    // Configuration of layer styling, for debug and for (optionally)
    // generating symbology icons for Legend and/or Layer Switcher
    sldStylerOptions: {
        // (Optional) DEBUG: display (in console) for all SLD-styled layers the
        // "featureTypeStyle" (i.e. styling from the SLD after parsing)
        //debugShowFeatureTypeStyle: true,

        // (Optional) Generate symbols for Map Legend
        showLegend: true,

        // (Optional) Symbol size overrides for Map Legend
        legendSymbolSizing: {
            width: 20,
            height: 15,
            margin: 2
        },
/*
        // (Optional) custom tweaks to "featureTypeStyle" extracted from QGIS
        // "layer_styles" SLD style information in OGC GeoPackage
        tweakFeatureTypeStyle: function(styleName, featureTypeStyle) {
            switch (styleName) {

                // Scale stroke dasharrays by stroke width to overcome bug in QGIS
                // "package layers" export of predefined (not custom) dash patterns
                case 'Footpaths':
                    // TBD: for footpaths does this need to be in tweakOlStyle?
                    scaleLineSymbolizerDashArray(featureTypeStyle);
                    break;
            }
            return featureTypeStyle;

            /**
             * Scale all stroke dasharrays in FeatureTypeStyle by stroke width
             * (helper function to overcome bug in QGIS "package layers" export
             *  when using predefined (not custom) dash patterns)
             * @param {object} o - FeatureTypeStyle object
             * /
            function scaleLineSymbolizerDashArray(o) {
                if (o.strokeDasharray && o.strokeWidth > 1) {
                    o.strokeDasharray = o.strokeDasharray.split(' ')
                        .map(x => parseFloat(x) * o.strokeWidth).join(' ');
                }
                for (var p in o) {
                    if (Object.prototype.hasOwnProperty.call(o, p) &&
                        typeof o[p] === 'object' ) {
                        scaleLineSymbolizerDashArray(o[p]);
                    }
                }
            }
        },
*/
        // (Optional) overrides to olStyle for things not possible to define
        // in "featureTypeStyle" itself. Gets called for every visible feature
        // (i.e. olStyle array will not be empty)
        // Args:
        //  featureTypeStyle: symbol style definition
        //  olStyle: OpenLayers Styles array
        //  styleName: styleName (or if not defined: table) from dataLayersConfig
        //  feature: current Openlayers Feature (or example feature if createSymbol true)
        //  resolution: (real) resolution in metres/pixel
        //  resolutionChanged: has resolution changed for any styles used by current feature
        //  createSymbol: call is only to create a symbol for Layer Switcher / Legend
        //  symbolLabel: symbol label (only defined when createSymbol true)
        tweakOlStyle: function(featureTypeStyle, olStyle, styleName, feature,
            resolution, resolutionChanged, createSymbol, symbolLabel) {

            var scaledFootpathWidth;
            var footpathProps;
            var footpathQuality;
            var strokeDasharray;
            var treeCrownRadius;
            var ftsRule;

/*
            // Current layers only need adjusting when resolution (zoom)
            // changes for that feature type
            if (!resolutionChanged) {
                return olStyle;
            }
*/
            switch (styleName) {
/*
                case 'Notable features (SVG Marker)':
                    // Set anchor points of external graphic and its label from
                    // SLD values exported by QGIS (currently ignored by sldreader)
                    setIconAnchorFromDisplacement(
                        featureTypeStyle.rules[0].pointsymbolizer.graphic,
                        olStyle[0].getImage());
                    break;
*/
                // Scale radius/width from pixels to metres
                // (for a projected SRS, resolution = metres/pixel)
                case 'Fruit trees':
/*
                    // For legend hand-craft resolution
                    if (createSymbol) {
                        resolution = (styleName === 'Visible remains')? 16.0 : 3.0;
                    }
*/
                    // Fruit tree circular crown radius (real metres)
                    treeCrownRadius = feature.getProperties()['crown_radius'];
                    olStyle[0].getImage().setRadius(treeCrownRadius / resolution);
                    break;

                case 'Footpaths':
                    footpathProps = feature.getProperties();

                    // For legend hand-craft resolution
                    if (createSymbol) {
                        resolution = 0.09;
                        footpathQuality = symbolLabel.toLowerCase();

                        // TBD: why only 1 rule when in createSymbol mode, but 3 otherwise?
                        ftsRule = featureTypeStyle['rules'][0];
                    } else {
                        footpathQuality = footpathProps['quality'];
                        ftsRule = featureTypeStyle['rules'][1];
                    }

                    scaledFootpathWidth = footpathProps['width_m'] / resolution;
                    olStyle[0].getStroke().setWidth(scaledFootpathWidth);
                    olStyle[0].setZIndex(100);
                    if (footpathQuality === 'patchy') {

                        // Patchy footpaths dashed - need to scale line-dash to width
                        strokeDasharray = ftsRule.linesymbolizer.stroke.styling
                            .strokeDasharray.split(' ');
                        olStyle[0].getStroke().setLineDash([
                            scaledFootpathWidth * strokeDasharray[0],
                            scaledFootpathWidth * strokeDasharray[1]]);
                    } else {//if (!createSymbol || symbolLabel !== 'Patchy') {

                        // Other footpaths have 2 styles: 0 (outline), 1 (inner fill)
                        olStyle[1].getStroke().setWidth(scaledFootpathWidth * 0.9);
                        olStyle[1].setZIndex(101);
                    }
                    break;
            }

            return olStyle;

            /**
             * Set anchor point of external graphic from SLD displacement values
             * (as exported by QGIS) but currently ignored by sldReader
             * @param {object} ftsGraphic - Feature Type Style rule
             *      pointsymbolizer.graphic object
             * @param {object} olStyleIcon - OpenLayers Style Icon Image object
             */
            function setIconAnchorFromDisplacement(ftsGraphic, olStyleIcon) {
                // Only define anchor once
                if (olStyleIcon.anchorDefined) {
                    return;
                }
                // setAnchor() method only exists after external graphic loaded
                if (typeof olStyleIcon.setAnchor === 'function') {
                    // TBD: if icon is not square, offsetX denominator may be wrong,
                    //      but getAnchor() could be used to determine aspect ratio.
                    var offsetX = ftsGraphic.displacement.displacementx /
                        ftsGraphic.size;
                    var offsetY = ftsGraphic.displacement.displacementy /
                        ftsGraphic.size;
                    olStyleIcon.setAnchor([0.5 - offsetX, 0.5 - offsetY]);
                    olStyleIcon.anchorDefined = true;
                }
            }
        }
    }
};
