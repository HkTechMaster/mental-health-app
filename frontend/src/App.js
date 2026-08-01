import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import Chat from './Chat';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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

  return (
    <div>
      {!token ? renderAuthScreen() : <Chat setToken={setToken} />}
    </div>
  );
}

export default App;