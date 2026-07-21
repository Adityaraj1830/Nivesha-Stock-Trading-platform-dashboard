import React, { useEffect, useRef, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const profileRef = useRef(null);

  const getUserInitials = () => {
    if (!user?.name) {
      return "NU";
    }

    const words = user.name.trim().split(" ");

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const getUserId = () => {
    if (!user?.id) {
      return "USER";
    }

    return `NV${user.id.slice(-6).toUpperCase()}`;
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen((previousState) => !previousState);
  };

  const handleNavigateToProfile = () => {
    setIsProfileDropdownOpen(false);
    navigate("/profile");
  };

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    await logout();
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  const initials = getUserInitials();
  const userId = getUserId();

  return (
    <div className="menu-container">
      <img src="/Nivesha Kite.png" alt="Nivesha" style={{ width: "100px" }} />

      <div className="menus">
        <ul>
          <li>
            <Link style={{ textDecoration: "none" }} to="/">
              <p
                className={
                  location.pathname === "/" ? activeMenuClass : menuClass
                }
              >
                Dashboard
              </p>
            </Link>
          </li>

          <li>
            <Link style={{ textDecoration: "none" }} to="/orders">
              <p
                className={
                  location.pathname.includes("orders")
                    ? activeMenuClass
                    : menuClass
                }
              >
                Orders
              </p>
            </Link>
          </li>

          <li>
            <Link style={{ textDecoration: "none" }} to="/holdings">
              <p
                className={
                  location.pathname.includes("holdings")
                    ? activeMenuClass
                    : menuClass
                }
              >
                Holdings
              </p>
            </Link>
          </li>

          <li>
            <Link style={{ textDecoration: "none" }} to="/positions">
              <p
                className={
                  location.pathname.includes("positions")
                    ? activeMenuClass
                    : menuClass
                }
              >
                Positions
              </p>
            </Link>
          </li>

          <li>
            <Link style={{ textDecoration: "none" }} to="/funds">
              <p
                className={
                  location.pathname.includes("funds")
                    ? activeMenuClass
                    : menuClass
                }
              >
                Funds
              </p>
            </Link>
          </li>
        </ul>

        <hr />

        <div className="profile-section" ref={profileRef}>
          <button
            type="button"
            className={`profile nivesha-profile-trigger ${
              isProfileDropdownOpen ? "profile-open" : ""
            }`}
            onClick={handleProfileClick}
          >
            <div className="avatar">{initials}</div>

            <div className="nivesha-profile-trigger-info">
              <p className="username">{userId}</p>

              <span>{user?.accountType || "Account"}</span>
            </div>

            <i
              className={`fa fa-angle-down nivesha-profile-chevron ${
                isProfileDropdownOpen ? "open" : ""
              }`}
              aria-hidden="true"
            ></i>
          </button>

          {isProfileDropdownOpen && (
            <div className="nivesha-profile-dropdown">
              <div className="nivesha-profile-dropdown-header">
                <div className="nivesha-profile-large-avatar">{initials}</div>

                <div>
                  <strong>{user?.name || "Nivesha User"}</strong>

                  <span>{userId}</span>
                </div>
              </div>

              <div className="nivesha-profile-dropdown-divider"></div>

              <button
                type="button"
                className="nivesha-profile-dropdown-item"
                onClick={handleNavigateToProfile}
              >
                <div className="nivesha-profile-dropdown-icon">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </div>

                <div>
                  <strong>My profile</strong>

                  <span>View your account details</span>
                </div>

                <i
                  className="fa fa-angle-right nivesha-dropdown-arrow"
                  aria-hidden="true"
                ></i>
              </button>

              <div className="nivesha-profile-dropdown-divider"></div>

              <button
                type="button"
                className="nivesha-profile-dropdown-item nivesha-logout-item"
                onClick={handleLogout}
              >
                <div className="nivesha-profile-dropdown-icon">
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                </div>

                <div>
                  <strong>Logout</strong>

                  <span>Sign out of your account</span>
                </div>

                <i
                  className="fa fa-angle-right nivesha-dropdown-arrow"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
