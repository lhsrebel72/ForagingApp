import React, { useRef, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import '../styles/MapBox.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapContext } from '../contexts/MapContext';
import Api from '../services/Api'; 
import Popup from './Popup';

mapboxgl.accessToken = 'pk.eyJ1IjoiendlbGRvbjQ1IiwiYSI6ImNsbHNzejE3aTBsbWUzZXFmNmdqcjg1bWUifQ.u5djRrC9i8BRIv-pkaURog';

function createMarkerDetails(coordinates) {
  return {
    name: prompt('Enter the name of the marker:'),
    date: new Date().toLocaleDateString(),
    coordinates_lng: coordinates.lng,
    coordinates_lat: coordinates.lat
  };
}

function placeMarker(marker, map){
  new mapboxgl.Marker()
  .setLngLat([marker.coordinates_lng, marker.coordinates_lat])
  .setPopup(new mapboxgl.Popup().setHTML(renderToString(<Popup name={marker.name} date={marker.date} />)))
  .addTo(map.current);
}

function MapBox() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const { clickListenerActive, setClickListenerActive } = useMapContext();

  useEffect(() => {
    if (!map.current) {    
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: zoom
      });} // initialize map only once

    if (map.current) {
      if (clickListenerActive) {
        map.current.on('click', handleMapClick);
      } else {
        map.current.off('click', handleMapClick);
      }
    }

    Api.getAllMarkers()
    .then(data => {
      console.log('All markers:', data);
      data.forEach(marker => {
        placeMarker(marker, map);
      });
    })
    .catch(error => {
      console.error('Error fetching markers:', error);
    });
  }, [clickListenerActive]);

  const handleMapClick = (event) => {
    const markerDetails = createMarkerDetails(event.lngLat);
  
    Api.addMarker(markerDetails)
      .then(data => {
        // If the marker was added successfully on the server, create a new map marker
        if (data) {
          placeMarker(data, map);
          map.current.off('click', handleMapClick);
        } else {
          console.error('Failed to add marker on the server');
        }
      });
  };

  return (
    <div ref={mapContainer} className="map-container" />
  );
}

export default MapBox;