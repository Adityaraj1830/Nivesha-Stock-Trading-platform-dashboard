import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

const Profile = () => {
  const navigate = useNavigate();

  const { user, authLoading, logout } = useAuth();

  if (authLoading) {
    return (
      <div className="nivesha-profile-page">
        <div className="nivesha-profile-loading">
          <div className="nivesha-profile-loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = () => {
    const words = user.name?.trim().split(" ").filter(Boolean);

    if (!words || words.length === 0) {
      return "NU";
    }

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const userId = `NV${user.id.slice(-6).toUpperCase()}`;

  return (
    <div className="nivesha-profile-page">
      <div className="nivesha-profile-page-header">
        <div>
          <span className="nivesha-profile-page-eyebrow">
            ACCOUNT & PROFILE
          </span>

          <h1>Your Nivesha Profile</h1>

          <p>Manage your identity and view your trading account information.</p>
        </div>

        <button
          type="button"
          className="nivesha-profile-back-button"
          onClick={() => navigate("/")}
        >
          <i className="fa fa-arrow-left" aria-hidden="true"></i>
          Back to dashboard
        </button>
      </div>

      <div className="nivesha-profile-hero">
        <div className="nivesha-profile-hero-pattern"></div>

        <div className="nivesha-profile-hero-content">
          <div className="nivesha-profile-identity">
            <div className="nivesha-profile-avatar-wrapper">
              <div className="nivesha-profile-main-avatar">{getInitials()}</div>

              <span className="nivesha-profile-online-indicator"></span>
            </div>

            <div className="nivesha-profile-main-info">
              <div className="nivesha-profile-name-row">
                <h2>{user.name}</h2>

                <span className="nivesha-profile-verified-badge">
                  <i className="fa fa-check" aria-hidden="true"></i>
                </span>
              </div>

              <p>@{user.username}</p>

              <div className="nivesha-profile-badges">
                <span className="nivesha-account-badge">
                  <i className="fa fa-user" aria-hidden="true"></i>
                  {user.accountType}
                </span>

                <span className="nivesha-active-badge">
                  <span></span>
                  {user.tradingStatus}
                </span>

                <span className="nivesha-profile-id-badge">
                  <i className="fa fa-id-card" aria-hidden="true"></i>
                  {userId}
                </span>
              </div>
            </div>
          </div>

          <div className="nivesha-profile-hero-meta">
            <div>
              <span>ACCOUNT ID</span>
              <strong>{userId}</strong>
            </div>

            <div className="nivesha-profile-hero-meta-divider"></div>

            <div>
              <span>ACCOUNT STATUS</span>

              <strong className="nivesha-profile-status-value">
                <span></span>
                {user.tradingStatus}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="nivesha-profile-quick-stats">
        <div className="nivesha-profile-quick-stat">
          <div className="nivesha-profile-quick-icon identity">
            <i className="fa fa-check-circle" aria-hidden="true"></i>
          </div>

          <div>
            <span>Identity</span>
            <strong>Verified account</strong>
          </div>
        </div>

        <div className="nivesha-profile-quick-stat">
          <div className="nivesha-profile-quick-icon delivery">
            <i className="fa fa-briefcase" aria-hidden="true"></i>
          </div>

          <div>
            <span>Delivery trading</span>
            <strong>CNC enabled</strong>
          </div>
        </div>

        <div className="nivesha-profile-quick-stat">
          <div className="nivesha-profile-quick-icon intraday">
            <i className="fa fa-line-chart" aria-hidden="true"></i>
          </div>

          <div>
            <span>Intraday trading</span>
            <strong>MIS enabled</strong>
          </div>
        </div>

        <div className="nivesha-profile-quick-stat">
          <div className="nivesha-profile-quick-icon security">
            <i className="fa fa-shield" aria-hidden="true"></i>
          </div>

          <div>
            <span>Session</span>
            <strong>Secure & active</strong>
          </div>
        </div>
      </div>

      <div className="nivesha-profile-content-grid">
        <div className="nivesha-profile-details-card">
          <div className="nivesha-profile-card-heading">
            <div>
              <span>PERSONAL INFORMATION</span>
              <h2>Your account details</h2>

              <p>Personal information associated with your Nivesha account.</p>
            </div>

            <div className="nivesha-profile-heading-icon">
              <i className="fa fa-address-card" aria-hidden="true"></i>
            </div>
          </div>

          <div className="nivesha-profile-details-list">
            <div className="nivesha-profile-detail-item">
              <div className="nivesha-profile-detail-icon">
                <i className="fa fa-user" aria-hidden="true"></i>
              </div>

              <div>
                <span>Full name</span>
                <strong>{user.name}</strong>
              </div>
            </div>

            <div className="nivesha-profile-detail-item">
              <div className="nivesha-profile-detail-icon">
                <i className="fa fa-at" aria-hidden="true"></i>
              </div>

              <div>
                <span>Username</span>
                <strong>@{user.username}</strong>
              </div>
            </div>

            <div className="nivesha-profile-detail-item nivesha-profile-email-item">
              <div className="nivesha-profile-detail-icon">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </div>

              <div>
                <span>Email address</span>
                <strong>{user.email}</strong>
              </div>
            </div>

            <div className="nivesha-profile-detail-item">
              <div className="nivesha-profile-detail-icon">
                <i className="fa fa-id-card" aria-hidden="true"></i>
              </div>

              <div>
                <span>Nivesha account ID</span>
                <strong>{userId}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="nivesha-profile-account-card">
          <div className="nivesha-profile-card-heading">
            <div>
              <span>TRADING ACCOUNT</span>
              <h2>Account capabilities</h2>

              <p>Your active trading products and account status.</p>
            </div>

            <div className="nivesha-profile-heading-icon">
              <i className="fa fa-line-chart" aria-hidden="true"></i>
            </div>
          </div>

          <div className="nivesha-profile-account-stats">
            <div>
              <div className="nivesha-profile-account-stat-top">
                <span>Account type</span>

                <i className="fa fa-user" aria-hidden="true"></i>
              </div>

              <strong>{user.accountType}</strong>
            </div>

            <div>
              <div className="nivesha-profile-account-stat-top">
                <span>Account status</span>

                <i className="fa fa-check-circle" aria-hidden="true"></i>
              </div>

              <strong className="nivesha-profile-active-text">
                {user.tradingStatus}
              </strong>
            </div>

            <div>
              <div className="nivesha-profile-account-stat-top">
                <span>Delivery</span>

                <i className="fa fa-briefcase" aria-hidden="true"></i>
              </div>

              <strong>CNC enabled</strong>
            </div>

            <div>
              <div className="nivesha-profile-account-stat-top">
                <span>Intraday</span>

                <i className="fa fa-bolt" aria-hidden="true"></i>
              </div>

              <strong>MIS enabled</strong>
            </div>
          </div>

          <div className="nivesha-profile-security-note">
            <div className="nivesha-profile-security-icon">
              <i className="fa fa-shield" aria-hidden="true"></i>
            </div>

            <div>
              <div className="nivesha-profile-security-heading">
                <strong>Secure account session</strong>

                <span>
                  <span></span>
                  Protected
                </span>
              </div>

              <p>
                Your account is authenticated and your active trading session is
                protected.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="nivesha-profile-account-security">
        <div className="nivesha-profile-account-security-content">
          <div className="nivesha-profile-account-security-icon">
            <i className="fa fa-lock" aria-hidden="true"></i>
          </div>

          <div>
            <span>ACCOUNT SECURITY</span>
            <h3>Your account session is protected</h3>

            <p>
              Always sign out when using Nivesha on a shared or public device.
            </p>
          </div>
        </div>

        <div className="nivesha-profile-security-actions">
          <div className="nivesha-profile-session-status">
            <span></span>

            <div>
              <small>Current session</small>
              <strong>Active now</strong>
            </div>
          </div>

          <button
            type="button"
            className="nivesha-profile-logout-button"
            onClick={logout}
          >
            <i className="fa fa-sign-out" aria-hidden="true"></i>
            Logout securely
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
