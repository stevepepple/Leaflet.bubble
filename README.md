Leaflet.bubble
==========

A simple library for bubble maps (or circle cartogram) visualization types.

[Demo is here](http://stevepepple.github.io/Leaflet.bubble/)

## About
This plugin is designed for Leaflet and Mapbox. All you need is a geoJSON file with a numeric value that will be visualized.

As with bubble charts, the size of the bubble's area should be used to visualize quantities, not the bubble radius.

This library is inspired by CartoDB bubble maps and


## Basic Usage

```js
bubbles = L.bubbleLayer(ca_cities, { property: "population" })
```

To include the plugin, just use `leaflet-bubble.js` from the `dist` folder:

```html
<script src="leaflet-bubble.js"></script>
```

## Building
To build the dist files run:
```npm install && npm run prepublish```


## Reference

#### L.bubbleLayer(geoJSON, options)

Creates a bubble or circle cartogram layer given an geoJSON file of points. Library accepts the following options.
You MUST specify a **property** field that is a **numeric** value.

//  color: blue,
//  legend : true,
//  max_radius: 40,
//  scale: <chroma-js color scale>,
//  style: { radius: 10, fillColor: "#74acb8", color: "#555", weight: 1, opacity: 0.8, fillOpacity: 0.5 }
//  tooltip: false,

- **color** - fill and border color of the bubbles or circles

- **minOpacity** - the minimum opacity the heat will start at
- **maxZoom** - zoom level where the points reach maximum intensity (as intensity scales with zoom),
  equals `maxZoom` of the map by default
- **max** - maximum point intensity, `1.0` by default
- **radius** - radius of each "point" of the heatmap, `25` by default
- **blur** - amount of blur, `15` by default
- **gradient** - color gradient config, e.g. `{0.4: 'blue', 0.65: 'lime', 1: 'red'}`

Each point in the input array can be either an array like `[50.5, 30.5, 0.5]`,
or a [Leaflet LatLng object](http://leafletjs.com/reference.html#latlng).

Optional third argument in each `LatLng` point (`altitude`) represents point intensity.
Unless `max` option is specified, intensity should range between `0.0` and `1.0`.


#### Methods

- **setOptions(options)**: Sets new heatmap options and redraws it.
- **addLatLng(latlng)**: Adds a new point to the heatmap and redraws it.
- **setLatLngs(latlngs)**: Resets heatmap data and redraws it.
- **redraw()**: Redraws the heatmap.

## Changelog

### 0.1 &mdash; Mar 12, 2015
