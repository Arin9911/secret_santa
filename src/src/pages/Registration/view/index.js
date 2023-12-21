import React, { useState } from "react";
import { Link } from "react-router-dom";
import { NotificationConfig } from "../../../utils/notification/notification";

const RegistrationForm = ({ onRegister, isLoading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    wish: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    wish: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear validation error when user starts typing
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) {
      // Validate form fields
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length === 0) {
        // No errors, proceed with registration
        onRegister(formData);
      } else {
        // Update state with validation errors
        setErrors(validationErrors);
        NotificationConfig.error(
          "Validation Error: Please fill all the fields"
        );
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Validate password
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    // Validate confirmPassword
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Validate address
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    // Validate wish
    if (!formData.wish.trim()) {
      errors.wish = "Wish is required";
    }

    return errors;
  };

  return (
    <div className="form_mainWrapper">
      <form
        className="form cancelRightPaddiing width305"
        onSubmit={handleSubmit}
      >
        <h2 className="marginLeftNegative">Register</h2>
        <div className="form-contentWrapper">
          <div className="form-content">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <div className="error">{errors.email}</div>
          </div>
          <div className="form-content">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <div className="error">{errors.password}</div>
          </div>
          <div className="form-content">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <div className="error">{errors.confirmPassword}</div>
          </div>
          <div className="form-content">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
            <div className="error">{errors.address}</div>
          </div>
          <div className="form-content">
            <label htmlFor="wish">Wish</label>
            <input
              type="text"
              id="wish"
              name="wish"
              value={formData.wish}
              onChange={handleChange}
            />
            <div className="error">{errors.wish}</div>
          </div>
        </div>
        <button className="cursorPointer RegisterButton" type="submit">
          {isLoading ? "Loading..." : "Register"}
        </button>
        <Link className="links" to="/login">
          <span className="loginButtonInRegister">Login</span>
        </Link>
      </form>
    </div>
  );
};

export default RegistrationForm;
