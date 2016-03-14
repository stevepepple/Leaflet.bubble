'use strict';

L.BubbleLayer = (L.Layer ? L.Layer : L.Class).extend({
  // options: {
  //  property: REQUIRED

  //  color: blue,
  //  legend : true,
  //  max_radius: 40,
  //  scale: <chroma-js color scale>,
  //  style: { radius: 10, fillColor: "#74acb8", color: "#555", weight: 1, opacity: 0.8, fillOpacity: 0.5 }
  //  tooltip: false,
  // },

  initialize: function (geojson, options) {

    console.log("initalized: ", options, geojson)

    this._geojson = geojson;

    options.max_radius = options.hasOwnProperty('max_radius') ? options.max_radius : 40;
    options.legend = options.hasOwnProperty('legend') ? options.legend : false;
    options.tooltip = options.hasOwnProperty('tooltip') ? options.tooltip : false;

    // TODO: set the minum radius to the radius in the style
    options.style = { radius: 10, fillColor: "#74acb8", color: "#555", weight: 1, opacity: 0.8, fillOpacity: 0.5 }

    L.setOptions(this, options);

    var valid = this._hasRequiredProp(this.options.property)
    //TODO: throw error if invalid.
    if (!valid) {
      throw "Error: you must provide an amount property that is include in every GeoJSON feature";
    }

  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  // When Layer is added to the map, present each point as a bubble
  onAdd: function(map) {

    this._map = map;

    // createLayer does the work of visualizing geoJSON as bubbles
    var geoJsonLayer = this.createLayer();
    this._layer = geoJsonLayer;
    map.addLayer(geoJsonLayer);

    if (this.options.tooltip) {
      this.showTooltip(geoJsonLayer);
    }

    if (this.options.legend) {
      console.log(this._scale, this._max)
      this.showLegend(this._scale, this._max);
    }

  },

  createLayer: function(geojson) {

    var max = this._getMax(this._geojson)

    // Caluclate the minimum and maximum radius from the max area
    // TODO: how to handle zero and negative values
    var min_area = Math.PI * 3 * 3;
    var max_area = Math.PI * this.options.max_radius * this.options.max_radius;

    // Scale by the maxium value in the dataset
    var scale = d3_scale.scaleLinear()
      .domain([0, max])
      .range([min_area, max_area]);

    // Store for reference
    this._scale = scale;
    this._max = max;

    // Use the selected property
    var property = this.options.property;
    var style = this.options.style;

    return new L.geoJson(this._geojson, {

      pointToLayer: function(feature, latlng) {

        // TODO Check if total is a valid amount
        var total = feature.properties[property];

        // Calculate the area of the bubble based on the property total and the resulting radius
        var area = scale(total);
        var radius = Math.sqrt(area / Math.PI)
        style.radius = radius;
        style.color = chroma(style.fillColor).darken().hex()

        // Create the circleMarker object
        var bubble = L.circleMarker(latlng, style);
        return bubble;
      }
    })
  },


  onRemove: function (map) {
    this._map = map;
    // Handle the native remove from map function
    map.removeLayer(this._layer);

  },

  showLegend: function(scale, max){

    var legend = L.control({position: 'bottomright'});
    var max_radius = this.options.max_radius;
    var fill = this.options.style.fillColor;

    legend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'info legend');
      div.innerHTML += '<strong>' + bubbles.options.property + '</strong><br/>';
      div.style = 'background-color: #FFF; padding: 8px; font-size: 14px; text-transform: capitalize'

      for (var i = 3; i > 0; i--) {

        var area = scale(max / i  / 2);
        var radius = Math.sqrt(area / Math.PI)
        console.log('radius', radius)

        var item = L.DomUtil.create('div', 'bubble');

        item.innerHTML = '<svg height="' + (max_radius * 2)  +'" width="' + (max_radius * 2 - (max_radius / 2)) + '">' +
          '<circle cx="' + radius + '" cy="' + max_radius + '" r="' + radius + '" stroke="' + chroma(fill).darken().hex() + '" stroke-width="1" fill="' + fill +'" />' +
           '<text font-size="11" text-anchor="middle" x="' + (radius) + '" y="' + (max_radius * 2) + '" fill="#AAA">' + numeral( max / i ).format('0 a');  + '</text>' +
        '</svg>';

        item.style = 'float:left; width: ' + radius + ';'
        div.appendChild(item)
      }

      return div;


    };

    // Add this one (only) for now, as the Population layer is on by default
    legend.addTo(map);
  },

  showTooltip: function(layer){
    layer.on('mouseover', function(e) {
      var tip = ""
      var props = e.layer.feature.properties;

      for (var key in props) {
        if (!props.hasOwnProperty(key)) continue;
        tip += "<strong>" + key + "</strong>: " + props[key] + "</br>";
      }

      e.layer.bindPopup(tip);
      e.layer.openPopup();

    });

    layer.on('mouseout', function(e) {
      e.layer.closePopup();
    });

  },

  _getMax : function(geoJson) {
    var max = 0;
    var features = this._geojson.features;
    var property = this.options.property;
    for (var i = 0; i < features.length; i++) {
      if (features[i].properties[property] > max) {
        max = features[i].properties[property];
      }
    }

    return max;
  },

  _hasRequiredProp : function(property) {
    var valid = true
    var features = this._geojson.features
    for (var i = 0; i < features.length; i++) {

      if (features[i].properties.hasOwnProperty(property) !== true) {
        valid = false;
      }
    }

    return valid;
  },

  _updateOptions: function() {
    // Get options and apply to the library
    this._heat.radius(this.options.radius || this._heat.defaultRadius, this.options.blur);

    if (this.options.gradient) {
        this._heat.gradient(this.options.gradient);
    }
    if (this.options.max) {
        this._heat.max(this.options.max);
    }
  },


});


L.heatLayer = function (latlngs, options) {
  return new L.HeatLayer(latlngs, options);
};

L.bubbleLayer = function (latlngs, options) {

  return new L.BubbleLayer(latlngs, options);
};
