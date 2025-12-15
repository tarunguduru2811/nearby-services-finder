import React from "react";
import "../App.css";

const categories = [
  "hospital",
  "restaurant",
  "school",
  "atm",
  "pharmacy",
  "bank",
  "supermarket",
  "gym",
];

function Filter({ selectedType, onChange }) {
  return (
    <div className="filter-container">
      <select value={selectedType} onChange={(e) => onChange(e.target.value)}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filter;
