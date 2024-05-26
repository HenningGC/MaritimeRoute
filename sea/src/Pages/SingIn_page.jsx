import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import Textfield from '../Components/TextField';
import '../Css/SignIn_page.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/signin', {
        username: email,
        password: password,
      });
      if (response.status === 200) {
        console.log('Sign-in successful');
        // Save the username in local storage
        localStorage.setItem('username', email);
        // Redirect to the homepage after successful sign-in
        navigate('/home');
      } else {
        console.log('Sign-in failed');
        // Handle sign-in failure
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      // Handle error
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-form">
        <form onSubmit={handleSubmit}>
          <Textfield
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sign-in-textfield"
            placeholder="Username"
          />
          <Textfield
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="sign-in-textfield"
            placeholder="Password"
          />
          <Button text="Navigate" onClick={handleSubmit} className="sign-in-button" />
        </form>
      </div>
    </div>
  );
};

export default SignIn;