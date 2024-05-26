import React, { useState } from 'react';
import '../Css/Navigation_page.css';
import VerticalNavigation from '../Components/VerticalMenu';
import Button from '../Components/Button';
import Textfield from '../Components/TextField';
import MapComponent from '../Components/Map';
import Spinner from '../Components/Spinner';

const NavigationPage = () => {
  const [departurePort, setDeparturePort] = useState('');
  const [arrivalPort, setArrivalPort] = useState('');
  const [journeyPriority, setJourneyPriority] = useState(50);
  const [selectedStartCoordinates, setSelectedStartCoordinates] = useState(null);
  const [selectedEndCoordinates, setSelectedEndCoordinates] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleJourneyPriorityChange = (e) => {
    setJourneyPriority(e.target.value);
  };

  const handlePointSelection = (clickedCoordinates, type) => {
    console.log('Received clicked coordinates:', clickedCoordinates);
    if (clickedCoordinates) {
      if (type === 'start') {
        setSelectedStartCoordinates(clickedCoordinates);
        setDeparturePort(`${clickedCoordinates.lat}, ${clickedCoordinates.lng}`);
        console.log('Set departure coordinates:', clickedCoordinates);
      } else if (type === 'end') {
        setSelectedEndCoordinates(clickedCoordinates);
        setArrivalPort(`${clickedCoordinates.lat}, ${clickedCoordinates.lng}`);
        console.log('Set arrival coordinates:', clickedCoordinates);
      }
    } else {
      console.log('Clicked coordinates are undefined');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStartCoordinates && selectedEndCoordinates) {
      const data = {
        start: [selectedStartCoordinates.lat, selectedStartCoordinates.lng],
        end: [selectedEndCoordinates.lat, selectedEndCoordinates.lng],
      };
      console.log('Form submitted:', data);

      setIsLoading(true);

      try {
        const response = await fetch('http://localhost:8000/calculate_path', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const path = await response.json();
          console.log('Path received:', path);
          setPathCoordinates(path);
        } else {
          console.error('Error fetching path:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching path:', error);
      }

      setIsLoading(false);
    } else {
      console.log('Start or end coordinates not selected');
    }
  };

  return (
    <div className="main-page">
      <VerticalNavigation />
      <div className="nv-content">
        <div className="nv-title">
          New Route:
          {isLoading && <Spinner />}
        </div>
        <div className="nv-map">
          <MapComponent onPointSelect={handlePointSelection} pathCoordinates={pathCoordinates} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="nv-container">
            <div className="nv-port-container">
              <Textfield
                label="Departure Port:"
                type="text"
                name="departurePort"
                value={departurePort}
                readOnly
                className="nv-textfield"
                placeholder="Enter departure port"
                onChange={() => console.log('Departure port changed')}
              />
              <Textfield
                label="Arrival Port:"
                type="text"
                name="arrivalPort"
                value={arrivalPort}
                readOnly
                className="nv-textfield"
                placeholder="Enter arrival port"
                onChange={() => console.log('Arrival port changed')}
              />
            </div>
            <div className="nv-slider-container">
              <h1 htmlFor="journeyPriority">Journey Priority:</h1>
              <input
                type="range"
                name="journeyPriority"
                min="0"
                max="100"
                value={journeyPriority}
                onChange={handleJourneyPriorityChange}
                className="nv-slider"
              />
              <span className="nv-slider-labels">
                <span>
                  Fuel
                  <div className="nv-fuel-percent">{journeyPriority}%</div>
                </span>
                <span>
                  Speed
                  <div className="nv-speed-percent">{100 - journeyPriority}%</div>
                </span>
              </span>
            </div>
          </div>
          <div className="nv-submit-container">
            <Button type="submit" text="Done" className="nv-button" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NavigationPage;