// App.js
import React from 'react';
import SignIn from './Pages/SingIn_page';
import HomePage from './Pages/Home_page';
import NavigationPage from './Pages/Navigation_page';
import TripsPage from './Pages/Trips_page';
import UserPage from './Pages/User_page';
import SettingsPage from './Pages/Settings_page';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/navigation" element={<NavigationPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
};

export default App;