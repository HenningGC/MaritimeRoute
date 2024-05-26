import React from 'react';
import '../Css/Home_page.css';
import VerticalNavigation from '../Components/VerticalMenu';

const HomePage = () => {
  // Retrieve the username from local storage
  const userName = localStorage.getItem('username');

  return (
    <div className="main-page">
      <VerticalNavigation />
      <div className="hp-content">
        <div className="welcome-message">
          Welcome Back, {userName}!
        </div>
      </div>
    </div>
  );
};

export default HomePage;