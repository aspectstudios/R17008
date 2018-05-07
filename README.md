# phase-2.01

> AHWR Phase 2.01


Todo 

2.  Convert all tif to stl with phstl script using mesh surface, or z base as above.
3. 

Sean

Tiles
---
0. Create water texture maps (for use in sketchfab specular and metalness maps)
	- Get water shapefile into QGIS
	- Export water layer as 776 clipped rasters tiles (do not keep input resolution, choose bit depth and JPEG 75 compression, reduce bands to 1 with "-b 1" flag) using final grid layer
	- Modify my python script to match your settings (`07_GIS\python\grid\main.py`)- you can prob do this.

1. Get buildings shapefile from data.sa.gov.au export raster tiles with those as white on black, (or shades of gray using building height expression in layer styling if there's time/data.) Export these the same way as water tiles above.

2. Find an automated way to create normal maps for all tiles as in the tutorials you sent, maybe using some python script, or batch photoshop plugin.

Regions
---
3. Re-size the nearmap region captures to higher resolution textures. If photoshop was only done on smaller versions, do it again on the large ones (shortcut may be "match color")



## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
