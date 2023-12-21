import React, { useState } from "react";
import Topbar from "../../Topbar/view";
import AddIcon from "../../../assets/plus-solid.svg";
import "../styles/index.scss";

const Cart = ({ user, onLogout, cart, setCartData }) => {
  const [updateAddIconClass, setUpdateAddIconClass] = useState(null);

  const onLogoutClick = () => {
    // Logout handler
    onLogout();
  };

  const onMouseEnterHandler = (e) => {
    // Mouse enter handler
    if (e.target.tagName === "IMG" || e.target.tagName === "P") {
      e.target.parentElement.querySelector("img")?.classList?.add("opacity");
      e.target.parentElement.querySelector("p")?.classList?.add("opacity");
    } else {
      e.target.querySelector("img")?.classList?.add("opacity");
      e.target.querySelector("p")?.classList?.add("opacity");
    }
    setUpdateAddIconClass({
      id: e.target.id || e.target.parentElement.id,
      showIcon: true,
    });
  };

  const onMouseLeaveHandler = (e) => {
    // Mouse leave handler
    if (e.target.tagName === "IMG" || e.target.tagName === "P") {
      e.target.parentElement.querySelector("img")?.classList?.remove("opacity");
      e.target.parentElement.querySelector("p")?.classList?.remove("opacity");
    } else {
      e.target.querySelector("img")?.classList?.remove("opacity");
      e.target.querySelector("p")?.classList?.remove("opacity");
    }

    setUpdateAddIconClass({
      id: e.target.id || e.target.parentElement.id,
      showIcon: false,
    });
  };

  const onCardClick = (data) => {
    // Card click handler
    const newCartList = cart.filter(
      (item) => Number(item.id) != Number(data.id)
    );
    setCartData(newCartList);
  };

  return (
    <>
      <Topbar user={user} onLogout={onLogoutClick} cart={cart} />
      <div className="cart_mainWrapper">
        {cart.map((item, key) => (
          <div
            onMouseEnter={onMouseEnterHandler}
            onMouseLeave={onMouseLeaveHandler}
            key={key}
            className="cart_cardWrapper"
            id={item?.id}
          >
            <img src={item.img} alt={item.title} />
            <img
              className={
                updateAddIconClass &&
                Number(updateAddIconClass.id) === Number(item.id) &&
                updateAddIconClass.showIcon
                  ? "addIcon cursorPointer"
                  : "addIcon hideAddIcon"
              }
              onClick={() => onCardClick(item)}
              src={AddIcon}
              alt="add-icon"
            />
            <p>{item.title}</p>
          </div>
        ))}
        {cart.length === 0 ? (
          <div className="emptyCart">Cart is empty</div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Cart;
