L.Control.Legend = L.Control.extend({
    _className: 'leaflet-legend-control',
    _headerClassName: this._className + '-header',
    _bodyClassName: this._className + '-body',

    _defaultParams: {
        wms: {
            request: 'GetLegendGraphic',
            format: 'image/png',
            legend_options: 'forceLabels:on',
            version: '1.3.0'
        }
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    options: {
        position: 'bottomright'
    },

    onAdd: function (map) {
        this._map = map;
        this._updateWmsLayers();
        this._container = L.DomUtil.create('div', 'leaflet-legend-control');
        this._header = L.DomUtil.create('div', this._headerClassName, this._container);
        this._header.innerHTML = "Legend";
        this._legends = L.DomUtil.create('div', this._bodyClassName, this._container);

        this._refresh();

        this._map.on("overlayadd", this._refresh, this);
        this._map.on("overlayremove", this._refresh, this);
        return this._container;
    },

    _refresh: function() {
        this._updateWmsLayers();
        this._legends.innerHTML = "";
        for (var i=0; i < this._wmsLayers.length; i++) {
            var layers = this._wmsLayers[i].options["layers"].split(",");
            var baseUrl = this._wmsLayers[i]._url;
            for (var j=0; j < layers.length; j++) {
                var legendImg = L.DomUtil.create('img', 'leaflet-wms-legend', this._legends);
                var params = this._defaultParams.wms;
                params.layer = layers[j]
                var url = baseUrl + L.Util.getParamString(params);
                legendImg.src = url;
                L.DomUtil.create('br', '', this._legends);
            }
        }
        if (this._wmsLayers.length === 0) {
            this._container.style.display = "none";
        } else {
            this._container.style.display = "inline";
        }
    },   
    
    _updateWmsLayers: function() {
        this._wmsLayers = [];
        this._map.eachLayer(function (layer) {
            if (layer instanceof L.TileLayer.WMS) {
                this._wmsLayers.push(layer);
            }
        }, this);
    },
});

L.control.legend = function (options) {
  return new L.Control.Legend(options);
};
