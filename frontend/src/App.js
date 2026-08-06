import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import Chat from './Chat';
import Dashboard from './Dashboard';
import About from './About';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState('chat');

  function renderAuthScreen() {
    if (showForgotPassword) {
      return <ForgotPassword setShowForgotPassword={setShowForgotPassword} />;
    }
    if (showSignup) {
      return <Signup setShowSignup={setShowSignup} />;
    }
    return (
      <Login
        setToken={setToken}
        setShowSignup={setShowSignup}
        setShowForgotPassword={setShowForgotPassword}
      />
    );
  }

  function renderLoggedInScreen() {
    if (currentPage === 'dashboard') {
      return <Dashboard setToken={setToken} currentPage={currentPage} setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === 'about') {
      return <About setToken={setToken} currentPage={currentPage} setCurrentPage={setCurrentPage} />;
    }
    return <Chat setToken={setToken} currentPage={currentPage} setCurrentPage={setCurrentPage} />;
  }

  return (
    <div>
      {!token ? renderAuthScreen() : renderLoggedInScreen()}
    </div>
  );
}

export default App;