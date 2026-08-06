import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import Chat from './Chat';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

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
    if (showDashboard) {
      return <Dashboard setShowDashboard={setShowDashboard} />;
    }
    return <Chat setToken={setToken} setShowDashboard={setShowDashboard} />;
  }

  return (
    <div>
      {!token ? renderAuthScreen() : renderLoggedInScreen()}
    </div>
  );
}

export default App;