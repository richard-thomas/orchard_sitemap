# Orchard Sitemap (QGIS to OpenLayers demo)

This web map (as hosted directly on GitHub) can be viewed via its [information page](https://richard-thomas.github.io/orchard_sitemap/info) or [directly](https://richard-thomas.github.io/orchard_sitemap/dist). It maps a small area of approximately 20m x 40m, but includes a large number of features with more detail being revealed as the user zooms progressively further in.

It is a demo of the [ol-sld-styler](https://www.npmjs.com/package/ol-sld-styler) (OpenLayers SLD Styler) and [ol-load-geopackage](https://www.npmjs.com/package/ol-load-geopackage) (OpenLayers OGC GeoPackage Loader) JavaScript NPM modules. Data and styling for the web map has been generated primarily in QGIS and exported as an OGC GeoPackage using the [Package Layers](https://docs.qgis.org/3.16/en/docs/user_manual/processing_algs/qgis/database.html#package-layers) Processing Toolbox operation. This allows the web map to be quickly rebuilt from subsequent updated QGIS exports.

The [OGC GeoPackage](https://www.geopackage.org/) used in this example is: [mrco_site_interactive.gpkg](https://github.com/richard-thomas/orchard_sitemap/tree/main/dist/mrco_site_interactive.gpkg). The Geopackage contains a collections of vector data layers and the associated SLD styling combined into a single "layer_styles" table as XML strings.

A version of the source QGIS map document used to generate the above GeoPackage can be loaded into QGIS from [orchard_site-local-gpkg.qgz](dist/orchard_site-local-gpkg.qgz). Note that this version has had its data sources redirected to the GeoPackage in the local folder (rather than the collection of original data sources).

The ol-sld-styler module requires a separate "layer configuration" object which is defined in this example in file [mapconfig.js](https://github.com/richard-thomas/orchard_sitemap/tree/main/dist/mapconfig.js). It includes some user-defined function hooks for modifying SLD-imported styling where desired styling was not possible due to QGIS export or SLD limitations.

By using OGC GeoPackages as its primary data/styling sources, this web map can also be downloaded and used as an _offline_ map viewer for mobile phones or tablets which have poor (or non-existent) network connectivity. When a network connection is available, data and stying updates could then be done by downloading just 1 file.

For more details of how to (re-)build this example, please see the sister-project in the [DS_Canal](https://github.com/richard-thomas/DS_Canal) GitHub repository.

## Licence

Original code in this module is provided under the ISC licence - see [LICENCE](LICENCE.md).

Raw spatial data created for this web map (i.e. the contents of file mrco_site_interactive.gpkg) is provided under the Creative Commons Attribution 4.0 [(CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/) International License.

## Acknowledgements

The following open source software and icons were used under licence:

- [Font Awesome](https://fontawesome.com/) v5 icons under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) licence
- [OpenLayers](https://openlayers.org/) [ol](https://www.npmjs.com/package/ol) NPM module: under the [BSD 2-Clause License](https://opensource.org/licenses/BSD-2-Clause)
- Proj4js [proj4](https://www.npmjs.com/package/proj4) NPM module under the [MIT](https://github.com/proj4js/proj4js/blob/master/LICENSE.md) licence
- OpenLayers OGC GeoPackage Loader [ol-load-geopackage](https://www.npmjs.com/package/ol-load-geopackage) NPM module under the [ISC](https://github.com/richard-thomas/ol-load-geopackage/blob/master/LICENCE.md) licence
- OpenLayers SLD Styler [ol-sld-styler](https://www.npmjs.com/package/ol-sld-styler) NPM module under the [ISC](https://github.com/richard-thomas/ol-sld-styler/blob/main/LICENCE.md) licence
- (Within ol-sld-styler) [@NieuwlandGeo/sldreader](https://www.npmjs.com/package/@nieuwlandgeo/sldreader) NPM module under the [ISC](https://github.com/NieuwlandGeo/SLDReader/blob/master/LICENSE) licence