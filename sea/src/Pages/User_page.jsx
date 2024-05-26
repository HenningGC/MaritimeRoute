import React from 'react';
import '../Css/User_page.css';
import VerticalNavigation from '../Components/VerticalMenu';

const UserPage = () => {

  return (
    <div className="user-page">
      <VerticalNavigation />
      <div className="u-content"/>
    </div>
  ); 
};

export default UserPage;