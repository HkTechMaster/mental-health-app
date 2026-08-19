import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from './config';

function ForgotPassword({ setShowForgotPassword }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setError('');
    setSuccess('');
    if (!email || !newPassword) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email, newPassword });
      setSuccess('Password updated. You can now sign in.');
      setTimeout(() => setShowForgotPassword(false), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.');
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
        <h1 className="auth-heading">Reset your password</h1>
        <p className="auth-subtext">Enter your email and choose a new password.</p>

        {error && <div className="form-error">{error}</div>}
        {success && (
          <div className="form-error" style={{ color: '#2F5D5A', background: 'rgba(47,93,90,0.08)', borderColor: 'rgba(47,93,90,0.2)' }}>
            {success}
          </div>
        )}

        <div className="field-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>

        <div className="field-group">
          <label>New Password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
        </div>

        <button className="btn-primary" onClick={handleReset} disabled={loading}>
          {loading ? 'Updating...' : 'Update password'}
        </button>

        <p className="auth-footer-text">
          Remembered your password? <span onClick={() => setShowForgotPassword(false)}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;