import React, { useState } from "react";
import { useNavigate } from "react-router";
import { NotificationConfig } from "../../../utils/notification/notification";
import { useLocation } from "react-router-dom";

const endpoint = "https://secsanta.hasura.app/v1/graphql";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

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

    // Validate form fields
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // const query = JSON.stringify({
      //   query: `mutation MyMutation {
      //     update_ss_registeredUsers_by_pk(pk_columns: {email: "${location.state.email}", _set: {confirmPassword: "${formData.confirmPassword}", password: "${formData.password}"}) {
      //       confirmPassword
      //       email
      //       password
      //     }
      //   }
      //   `,
      // });

      // console.log("qyery - ", query);

      // mutation MyMutation {
      //   update_ss_registeredUsers_by_pk(pk_columns: {email: "lajat.panda@happiestminds.com"}, _set: {confirmPassword: "1234567", password: "1234567"}) {
      //     confirmPassword
      //     email
      //     password
      //   }
      // }

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret":
            "OkSFKkndGHnmSl6x2ePbxuiW6wNcyfHR86e7Va6K1RmnLq9udZEYR8ECadLNfsjM",
        },
        body: JSON.stringify({
          query: `mutation MyMutation {
            update_ss_registeredUsers_by_pk(pk_columns: {email: "${location.state.email}", _set: {confirmPassword: "${formData.confirmPassword}", password: "${formData.password}"}) {
              confirmPassword
              email
              password
            }
          }
          `,
        }),
      })
        .then((response) => {
          console.log("response -", response);
          if (response.status >= 400) {
            throw new Error("Error fetching data");
          } else {
            // NotificationConfig.success("User registered successfully");
            // navigate("/login");
            return response.json();
          }
        })
        .then((data) => {
          console.log("Updated_Registered user", data);
        });

      // const registeredUsers = JSON.parse(
      //   localStorage.getItem("registeredUser")
      // );
      // registeredUsers.map((item) => {
      //   if (item.email === location.state.email) {
      //     item.password = formData.password;
      //     item.confirmPassword = formData.confirmPassword;
      //   }
      // });
      // localStorage.setItem("registeredUser", JSON.stringify(registeredUsers));
      // // No errors, proceed with login
      // navigate("/login");
      // NotificationConfig.success("Password updated successfully");
    } else {
      // Update state with validation errors
      setErrors(validationErrors);
      NotificationConfig.error("Password update failed");
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate password
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm Password is required";
    }

    return errors;
  };

  return (
    <div className="form_mainWrapper">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
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
        <button className="marginBottom25 cursorPointer" type="submit">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
