import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from './config';

function Signup({ setShowSignup }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError('');
    setSuccess('');
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password });
      setSuccess('Account created. You can now sign in.');
      setTimeout(() => setShowSignup(false), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <span className="breathing-dot"></span>
          Solace
        </div>
        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-subtext">Start your first conversation with Solace.</p>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-error" style={{ color: '#2F5D5A', background: 'rgba(47,93,90,0.08)', borderColor: 'rgba(47,93,90,0.2)' }}>{success}</div>}

        <div className="field-group">
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </div>

        <div className="field-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>

        <div className="field-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" />
        </div>

        <button className="btn-primary" onClick={handleSignup} disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="auth-footer-text">
          Already have an account? <span onClick={() => setShowSignup(false)}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;