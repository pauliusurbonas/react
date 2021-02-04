import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './style/WeatherMap.scss';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOXGL_API_KEY

export default class WeatherMap extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.props.lng, this.props.lat],
      zoom: 5
    });

    this.map.addControl(
      new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
        trackUserLocation: true
      })
    );

    this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    var that = this;
    this.map.on('load', function(){
      that.map.addLayer({
        "id": "simple-tiles",
        "type": "raster",
        "source": {
          "type": "raster",
          "tiles": ["https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=" + process.env.REACT_APP_OPENWEATHERMAP_API_KEY],
          "tileSize": 256
        },
        "minzoom": 0,
        "maxzoom": 22
      });
    });
  }

  flyToPosition(lng, lat, temp) {
    this.map.flyTo({
      center: [
        lng,
        lat
      ],
      zoom: 6,
      essential: true
      });

      // var popup = new mapboxgl.Popup({ closeOnClick: true })
      //   .setLngLat([lng, lat])
      //   .setHTML('<span>' + temp + '℃</span>')
      //   .addTo(this.map);
      }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div className="map-cont" ref={el => this.mapContainer = el} />;
  }
}
