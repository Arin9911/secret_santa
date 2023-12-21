import React, { useState } from "react";
import { useNavigate } from "react-router";
import { NotificationConfig } from "../../../utils/notification/notification";

const endpoint = "https://secsanta.hasura.app/v1/graphql";
let Get_Registerd_User_By_Email_Query = `{
  ss_registeredUsers_by_pk(email: $email) {
    confirmPassword
    email
    password
  }
}`;

const EmailVerification = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
  });
  const navigate = useNavigate();

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
      const newGet_Registerd_User_By_Email_Query =
        Get_Registerd_User_By_Email_Query.replace(
          "$email",
          `"${formData.email}"`
        );

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret":
            "OkSFKkndGHnmSl6x2ePbxuiW6wNcyfHR86e7Va6K1RmnLq9udZEYR8ECadLNfsjM",
        },
        body: JSON.stringify({
          query: newGet_Registerd_User_By_Email_Query,
        }),
      })
        .then((response) => {
          if (response.status >= 400) {
            throw new Error("Error fetching data");
          } else {
            return response.json();
          }
        })
        .then((data) => {
          if (data?.data?.ss_registeredUsers_by_pk) {
            // No errors, proceed with login
            navigate("/forgot-password", { state: formData });
            NotificationConfig.success("Email verified successfully");
          } else {
            NotificationConfig.error(
              "Email verification failed. No user found"
            );
            // navigate("/login");
          }
        });
    } else {
      // Update state with validation errors
      setErrors(validationErrors);
      NotificationConfig.error("Email verification failed");
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

    return errors;
  };

  return (
    <div className="form_mainWrapper">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Email Verification</h2>
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
        <button className="marginBottom25 cursorPointer" type="submit">
          Verify
        </button>
      </form>
    </div>
  );
};

export default EmailVerification;
