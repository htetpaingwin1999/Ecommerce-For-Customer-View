import React, { useEffect, useRef, useState } from "react";
import "select2/dist/css/select2.css";
import "select2";
import jQuer from "jquery";

const CitySelect = ({ city, setCity }) => {
  const selectRef = useRef(null);
  
  const [myanmarStates, setMyanmarStates] = useState([]); // State to store the JSON data

  useEffect(() => {
    // Fetch the JSON data from the GitHub URL
    fetch("https://raw.githubusercontent.com/lawinko/MyanmarStates.json/master/myanmarstates.json")
      .then((response) => response.json())
      .then((data) => setMyanmarStates(data))
      .catch((error) => console.error("Error fetching data:", error));

    // Initialize select2 on component mount
    $(selectRef.current).select2();
  }, []);

  // Rest of your component code

  return (
    <select ref={selectRef} value={city} onChange={handleCityChange} className="js-select2">
      <option value="">Select a city</option>
      {myanmarStates.flatMap((region) =>
        region.townships.map((township) => (
          <option key={township.township} value={township.township}>
            {township.township}
          </option>
        ))
      )}
    </select>
  );
};

export default CitySelect;
