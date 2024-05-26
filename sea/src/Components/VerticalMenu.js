import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import '../Css/VerticalMenu.css';

const VerticalNavigation = () => {
  const [activeButton, setActiveButton] = useState('');
  const location = useLocation();

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <nav className="vertical-navigation">
      <div className="logo"></div>
      <div className="top-buttons">
        <ul>
          <li>
            <Link to="/home">
              <Button
                text="Home"
                onClick={() => handleButtonClick('Home')}
                className={`menu-button ${location.pathname === '/home' ? 'active' : ''}`}
              />
            </Link>
          </li>
          <li>
            <Link to="/navigation">
              <Button
                text="Navigation"
                onClick={() => handleButtonClick('Navigation')}
                className={`menu-button ${location.pathname === '/navigation' ? 'active' : ''}`}
              />
            </Link>
            </li>
            <li>
            <Link to="/trips">
              <Button
                text="Trips"
                onClick={() => handleButtonClick('Trips')}
                className={`menu-button ${location.pathname === '/trips' ? 'active' : ''}`}
              />
            </Link>
          </li>
        </ul>
      </div>
      <div className="bottom-buttons">
        <ul>
          <li>
            <Link to="/user">
              <Button
                text="My Profile"
                onClick={() => handleButtonClick('My Profile')}
                className={`menu-button ${location.pathname === '/user' ? 'active' : ''}`}
              />
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <Button
                text="Settings"
                onClick={() => handleButtonClick('Settings')}
                className={`menu-button ${location.pathname === '/settings' ? 'active' : ''}`}
              />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default VerticalNavigation;