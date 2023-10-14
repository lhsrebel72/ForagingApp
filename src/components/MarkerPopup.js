import React from 'react';
import '../styles/Popup.css';

function MarkerPopup({ id, name, date, onDeleteMarker}) {
  //need to get id from the server
  const handleDeleteClick = () => {
    onDeleteMarker(id);
  };

  return (
    <div className="marker-popup">
      <h3>{name}</h3>
      <p>{date}</p>
      <button onClick={handleDeleteClick}>Delete</button>
    </div>
  );
}

export default MarkerPopup;