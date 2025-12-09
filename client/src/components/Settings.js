import React, { useState } from 'react';
import './Settings.css';
import { userService } from '../services/api';

const menuItems = [
  {
    key: 'password',
    label: 'Change Password',
    description: 'Update your account password',
  },
];

const Settings = ({ accessToken, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [activeSection, setActiveSection] = useState(null);

  const openSection = (key) => {
    setActiveSection(key);
    setStatus({ type: '', message: '' });
    setNewPassword('');
    setConfirmPassword('');
  };

  const backToMenu = () => {
    setActiveSection(null);
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!newPassword || !confirmPassword) {
      setStatus({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    if (newPassword.length < 8) {
      setStatus({
        type: 'error',
        message: 'Password must be at least 8 characters long',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);
      await userService.changePassword(newPassword, accessToken);
      setStatus({
        type: 'success',
        message: 'Password updated successfully',
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to update password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        {onClose && (
          <button
            type="button"
            className="icon-button"
            aria-label="Close settings"
            onClick={onClose}
          >
            ✕
          </button>
        )}
      </div>

      <div className={`settings-body ${activeSection ? 'detail-view' : 'menu-view'}`}>
        {!activeSection && (
          <div className="settings-menu-list">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className="menu-item"
                onClick={() => openSection(item.key)}
                type="button"
              >
                <span className="menu-title">{item.label}</span>
                {item.description && (
                  <span className="menu-subtitle">{item.description}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {activeSection === 'password' && (
          <div className="settings-content">
            <button className="back-button" type="button" onClick={backToMenu}>
              ← Back to Settings
            </button>
            <div className="settings-card">
              <h3>Change Password</h3>
              <p className="settings-description">
                Update your account password. Use at least 8 characters.
              </p>
              <form className="settings-form" onSubmit={handleSubmit}>
                <label>
                  New Password
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                </label>
                <label>
                  Confirm New Password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                  />
                </label>

                {status.message && (
                  <div
                    className={`settings-alert ${
                      status.type === 'error' ? 'error' : 'success'
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
