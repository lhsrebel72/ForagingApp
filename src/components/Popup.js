import React from 'react';
import '../styles/Popup.css';

function Popup({ name, date }) {
  return (
    <div className="marker-popup">
      <h3>{name}</h3>
      <p>{date}</p>
    </div>
  );
}

export default Popup;