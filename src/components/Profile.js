import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

const Profile = () => {
  const navigate = useNavigate();

  const { user, authLoading, logout } = useAuth();

  if (authLoading) {
    return (
      <div className="nivesha-profile-page">
        <div className="nivesha-profile-footer-note">
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
          <span className="nivesha-profile-page-eyebrow">ACCOUNT</span>

          <h1>My Profile</h1>

          <p>
            View your personal information and Nivesha trading account details.
          </p>
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

      <div className="nivesha-profile-overview-card">
        <div className="nivesha-profile-cover"></div>

        <div className="nivesha-profile-overview-content">
          <div className="nivesha-profile-main-avatar">{getInitials()}</div>

          <div className="nivesha-profile-main-info">
            <h2>{user.name}</h2>

            <p>{userId}</p>

            <div className="nivesha-profile-badges">
              <span className="nivesha-account-badge">
                <i className="fa fa-user" aria-hidden="true"></i>

                {user.accountType}
              </span>

              <span className="nivesha-active-badge">
                <span></span>

                {user.tradingStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="nivesha-profile-content-grid">
        <div className="nivesha-profile-details-card">
          <div className="nivesha-profile-card-heading">
            <div>
              <span>PERSONAL DETAILS</span>

              <h2>Account information</h2>
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
                <i className="fa fa-id-card" aria-hidden="true"></i>
              </div>

              <div>
                <span>User ID</span>
                <strong>{userId}</strong>
              </div>
            </div>

            <div className="nivesha-profile-detail-item">
              <div className="nivesha-profile-detail-icon">
                <i className="fa fa-phone" aria-hidden="true"></i>
              </div>

              <div>
                <span>Phone number</span>

                <strong>{user.phoneNumber}</strong>
              </div>
            </div>

            <div className="nivesha-profile-detail-item">
              <div className="nivesha-profile-detail-icon">
                <i className="fa fa-check-circle" aria-hidden="true"></i>
              </div>

              <div>
                <span>Verification</span>
                <strong>Phone verified</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="nivesha-profile-account-card">
          <div className="nivesha-profile-card-heading">
            <div>
              <span>TRADING ACCOUNT</span>

              <h2>Account overview</h2>
            </div>

            <div className="nivesha-profile-heading-icon">
              <i className="fa fa-line-chart" aria-hidden="true"></i>
            </div>
          </div>

          <div className="nivesha-profile-account-stats">
            <div>
              <span>Account type</span>

              <strong>{user.accountType}</strong>
            </div>

            <div>
              <span>Account status</span>

              <strong className="nivesha-profile-active-text">
                {user.tradingStatus}
              </strong>
            </div>

            <div>
              <span>Delivery trading</span>
              <strong>CNC enabled</strong>
            </div>

            <div>
              <span>Intraday trading</span>
              <strong>MIS enabled</strong>
            </div>
          </div>

          <div className="nivesha-profile-security-note">
            <div className="nivesha-profile-security-icon">
              <i className="fa fa-shield" aria-hidden="true"></i>
            </div>

            <div>
              <strong>Account authenticated</strong>

              <p>
                Your phone number has been verified and your Nivesha session is
                active.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="nivesha-profile-footer-note">
        <i className="fa fa-shield" aria-hidden="true"></i>

        <p>You are securely signed in to your Nivesha account.</p>

        <button
          type="button"
          onClick={logout}
          style={{
            marginLeft: "auto",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
