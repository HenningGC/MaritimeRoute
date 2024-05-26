import React from 'react';
import '../Css/Trips_page.css';
import VerticalNavigation from '../Components/VerticalMenu';

const TripPage = () => {

  return (
    <div className="trips-page">
      <VerticalNavigation />
      <div className="tp-content"/>
    </div>
  );
};

export default TripPage;