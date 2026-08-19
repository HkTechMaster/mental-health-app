import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from './config';

function Login({ setToken, setShowSignup, setShowForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <span className="breathing-dot"></span>
          Manochikitsak
        </div>
        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subtext">Sign in to continue your conversation.</p>

        {error && <div className="form-error">{error}</div>}

        <div className="field-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>

        <div className="field-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="auth-footer-text" style={{ marginTop: '10px' }}>
          <span onClick={() => setShowForgotPassword(true)}>Forgot password?</span>
        </p>
        
        <p className="auth-footer-text">
          New here? <span onClick={() => setShowSignup(true)}>Create an account</span>
        </p>
      </div>
    </div>
  );
}

export default Login;