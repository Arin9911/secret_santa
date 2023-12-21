import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OpenCart from "../../../assets/opencart.svg";
import "../styles/index.scss";

const Topbar = ({ user, onLogout, cart }) => {
  const [username] = useState(user?.username);
  const navigate = useNavigate();

  const onLogoutClicked = () => {
    // Logout handler
    onLogout();
  };

  return (
    <header className="topbar">
      <div className="cursorPointer" onClick={() => navigate("/")}>
        <h1>
          <i>Fo0</i>d <i>cluB</i>
        </h1>
      </div>
      <div className="account">
        <h3>
          <i>Welcome, </i>
          {username}
        </h3>
        <Link to="/cart">
          <div className="cartWrapper">
            <img src={OpenCart} alt="open-cart" />
            {cart.length > 0 ? (
              <div className="cartItem">
                <p>{cart.length}</p>
              </div>
            ) : null}
          </div>
        </Link>
        <p className="logout_link cursorPointer" onClick={onLogoutClicked}>
          Logout
        </p>
      </div>
    </header>
  );
};

export default Topbar;
