import React, { useState } from "react";
import { Link } from "react-router-dom";
import { NotificationConfig } from "../../../utils/notification/notification";

const LoginForm = ({ onLogin, isLoading }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

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
        // No errors, proceed with login
        onLogin(formData);
      } else {
        // Update state with validation errors
        setErrors(validationErrors);
        NotificationConfig.error("User login failed");
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

    return errors;
  };

  return (
    <div className="form_mainWrapper">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        <button className="cursorPointer" type="submit">
          {isLoading ? "Loading..." : "Login"}
        </button>
        <div className="linksWrapper">
          <Link className="links" to="/register">
            <p>Register</p>
          </Link>
          {/* <Link className="links" to="/email-verification">
            <p>Forgot Password?</p>
          </Link> */}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
