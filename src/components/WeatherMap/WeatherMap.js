import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './style/WeatherMap.scss';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOXGL_API_KEY

const WeatherMap = (map) => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(5);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(1.5);

  // Initialize map when component mounts
  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation control (the +/- zoom buttons)
    //map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    map.on('load', function(){
      map.addLayer({
        "id": "simple-tiles",
        "type": "raster",
        "source": {
          "type": "raster",
          "tiles": ["https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=da9bf4fda4b30e8f99c29721f7de5192"],
          "tileSize": 256
        },
        "minzoom": 0,
        "maxzoom": 22
      });
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='map-cont' ref={mapContainerRef} />
  );
};

export default WeatherMap;
