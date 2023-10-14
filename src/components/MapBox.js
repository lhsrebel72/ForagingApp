import React, { useRef, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import '../styles/MapBox.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapContext } from '../contexts/MapContext';
import Api from '../services/Api'; 
import MarkerPopup from './MarkerPopup';
import {createMarkerDTO, createMarkerDatabaseObject, createMarkerDTOFromDatabaseRow} from '../Utils/MarkerDTO'; 
import * as ReactDOMClient from 'react-dom/client';

mapboxgl.accessToken = 'pk.eyJ1IjoiendlbGRvbjQ1IiwiYSI6ImNsbHNzejE3aTBsbWUzZXFmNmdqcjg1bWUifQ.u5djRrC9i8BRIv-pkaURog';

function createMarkerDetails(coordinates) {
  const name = prompt('Enter the name of the marker:');
  const date = new Date().toLocaleDateString();
  return createMarkerDTO(name, date, coordinates.lat, coordinates.lng);
}

function useMarkers() {
  const [markers, setMarkers] = useState({});

  async function handleDeleteMarker(id) {
    const markerToDelete = markers[id];

    if (!markerToDelete) {
      throw new Error(`Marker with id ${id} not found`);
    }

    markerToDelete.remove();

    try {
      const response = await Api.deleteMarker(id);

      if (response.message === 'Marker deleted successfully') {
        setMarkers(prevMarkers => {
          const { [id]: removedMarker, ...rest } = prevMarkers;
          return rest;
        });
      } else {
        throw new Error('Failed to delete marker on the server');
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  function placeMarker(marker, map) {
    const placeholder = document.createElement('div');
    const root = ReactDOMClient.createRoot(placeholder);
    root.render(<MarkerPopup id={marker.id} name={marker.name} date={marker.date} onDeleteMarker={handleDeleteMarker} />);
    const newMarker = new mapboxgl.Marker()
      .setLngLat([marker.coordinates_lng, marker.coordinates_lat])
      .setPopup(new mapboxgl.Popup().setDOMContent(placeholder))
    newMarker.addTo(map.current);
    setMarkers(prevMarkers => ({ ...prevMarkers, [marker.id]: newMarker }));
  }

  return { markers, placeMarker, handleDeleteMarker };
}

function MapBox() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const { markers, placeMarker, handleDeleteMarker } = useMarkers();
  const { clickListenerActive, setClickListenerActive } = useMapContext();

  const  handleMapClick = (event) => {
    const markerDetails = createMarkerDetails(event.lngLat);
  
    Api.addMarker(markerDetails)
      .then(data => {
        // If the marker was added successfully on the server, create a new map marker
        if (data) {
          const marker = createMarkerDTOFromDatabaseRow(data);
          placeMarker(marker, map);
          map.current.off('click', handleMapClick);
        } else {
          console.error('Failed to add marker on the server');
        }
      });
  };

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
      data.forEach(data => {
        const marker = createMarkerDTOFromDatabaseRow(data);
        placeMarker(marker, map);
      });
    })
    .catch(error => {
      console.error('Error fetching markers:', error);
    });
  }, [clickListenerActive]);

  return (
    <div ref={mapContainer} className="map-container" />
  );
}

export default MapBox;