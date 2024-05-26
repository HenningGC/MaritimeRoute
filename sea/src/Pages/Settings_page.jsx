import React from 'react';
import '../Css/Settings_page.css';
import VerticalNavigation from '../Components/VerticalMenu';

const SettingsPage = () => {

  return (
    <div className="settings-page">
      <VerticalNavigation />
      <div className="st-content"/>
    </div>
  );
};

export default SettingsPage;