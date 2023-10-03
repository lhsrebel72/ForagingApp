import React, { createContext, useContext, useState } from 'react';

const MapContext = createContext();

export const useMapContext = () => {
  return useContext(MapContext);
};

export const MapProvider = ({ children }) => {
  const [clickListenerActive, setClickListenerActive] = useState(false);

  return (
    <MapContext.Provider value={{ clickListenerActive, setClickListenerActive }}>
      {children}
    </MapContext.Provider>
  );
};