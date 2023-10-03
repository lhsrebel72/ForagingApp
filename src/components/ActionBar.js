import React from 'react';
import { useMapContext } from '../contexts/MapContext';
import '../styles/ActionBar.css';

function ActionBar() {
  const { clickListenerActive, setClickListenerActive } = useMapContext();

  const toggleClickListener = () => {
    setClickListenerActive(!clickListenerActive);
  };

  return (
    <div className="action-bar">
      <button className="action-button" onClick={toggleClickListener}>
        Add Marker
      </button>
      <button className="action-button">Action 2</button>
      <button className="action-button">Action 3</button>
    </div>
  );
}

export default ActionBar;