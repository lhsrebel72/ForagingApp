import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useEffect, useState } from 'react';
import ActionBar from './components/ActionBar'; 
import MapBox from './components/MapBox'; 
 
function App() {
    return (
      <div className="container">
        <ActionBar />
        <MapBox />
      </div>
      );
}

export default App;