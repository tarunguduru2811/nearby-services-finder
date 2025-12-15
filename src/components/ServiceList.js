import React from "react";
import "../App.css";

function ServiceList({ places, onSelect }) {
  return (
    <div className="service-list">
      {places.length === 0 && <p>No places found nearby.</p>}
      {places.map((place) => (
        <div key={place.id} className="card" onClick={() => onSelect(place)}>
          <h3>{place.name}</h3>
          <p>{place.address}</p>
          <p><strong>{place.distance.toFixed(2)} km away</strong></p>
        </div>
      ))}
    </div>
  );
}

export default ServiceList;
