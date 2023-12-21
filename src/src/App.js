import React, { useState, useEffect } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import RegistrationForm from "./pages/Registration/view";
import LoginForm from "./pages/Login/view";
import Cart from "./pages/Cart/view";
import Dashboard from "./pages/Dashboard/view";
import ForgotPassword from "./pages/ForgotPassword/view";
import EmailVerification from "./pages/EmailVerification/view";
import { useNavigate } from "react-router";
import { NotificationConfig } from "./utils/notification/notification";

const endpoint = "https://secsanta.hasura.app/v1/graphql";
let Names_Get_Query = `{
  ss_users {
    address
    email
    name
    wishes
  }
}`;

let Names_Delete_Query = `{
  names {
    delete_names_by_pk(email: $email) {
      email
      name
    }
}`;

let Match_Post_Query = `{
  insert_match_one(object: $object) {
    matchedWith
    secretSanta
  }
}`;

let Get_Registerd_User_By_Email_Query = `{
  ss_registeredUsers_by_pk(email: $email) {
    confirmPassword
    email
    password
  }
}`;

// let Post_Registerd_User_Query = `{
//   insert_ss_registeredUsers_one(object: $object) {
//     confirmPassword
//     email
//     password
//   }
// }`;

let Post_Registerd_User_Query = `{
  insert_ss_registeredUsers_one(object: {confirmPassword: "", email: "", password: ""}) {
    confirmPassword
    email
    password
  }
}`;

let Update_Registerd_User_By_Email_Query = `{
  update_registeredUser_by_pk(pk_columns: {email: $email}, _set: $object) {
    confirmPassword
    email
    password
  }
}`;

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState(Names_Get_Query);
  const [queryType, setQueryType] = useState("Names_Get_Query");
  const [namesList, setNamesList] = useState([]);
  const [loginData, setLoginData] = useState(null);
  const [registerData, setRegisterData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [registeredUser, setRegisteredUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (query) {
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret":
            "OkSFKkndGHnmSl6x2ePbxuiW6wNcyfHR86e7Va6K1RmnLq9udZEYR8ECadLNfsjM",
        },
        body: JSON.stringify({
          query: query,
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
          if (queryType === "Names_Get_Query")
            setNamesList(data?.data?.ss_users);
          else if (queryType === "Get_Registerd_User_By_Email_Query") {
            // setRegisteredUser(data?.data?.ss_registeredUsers_by_pk);
            if (window.location.pathname === "/login")
              loginResult(data?.data?.ss_registeredUsers_by_pk);
            else if (window.location.pathname === "/register")
              registerResult(data?.data?.ss_registeredUsers_by_pk);
          } else if (queryType === "Update_Registerd_User_By_Email_Query") {
            console.log("updated register user", data);
          } else if (queryType === "Post_Registerd_User_Query")
            console.log("Registered user", data);
        });
      setQuery(null);
    }
  }, [query]);

  const handleLogin = (data) => {
    setIsLoading(true);
    setLoginData(data);
    // Login handler
    const newGet_Registerd_User_By_Email_Query =
      Get_Registerd_User_By_Email_Query.replace(
        "$email",
        `"${data.email || ""}"`
      );
    setQuery(newGet_Registerd_User_By_Email_Query);
    setQueryType("Get_Registerd_User_By_Email_Query");
  };

  const loginResult = (data) => {
    if (data) {
      if (data?.email.includes("@happiestminds.com")) {
        if (data.password === loginData?.password) {
          // Save user data to local storage
          setNamesList(
            namesList.filter((item) => {
              if (item.email === data?.email) {
                setUser({ ...loginData, ["name"]: item.name });
                localStorage.setItem(
                  "user",
                  JSON.stringify({ ...loginData, ["name"]: item.name })
                );
              } else return item;
            })
          );
          NotificationConfig.success("User logged in successfully");
        } else
          NotificationConfig.error("User login failed. Please verify password");
      } else
        NotificationConfig.error(
          "User login failed. Not a Happiest Minds Employee"
        );
    } else {
      navigate("/register");
      NotificationConfig.error("User not registered. Please register");
    }
    setIsLoading(false);
  };

  const handleRegister = (userData) => {
    setIsLoading(true);
    setRegisterData(userData);
    // Register handler
    const newGet_Registerd_User_By_Email_Query =
      Get_Registerd_User_By_Email_Query.replace(
        "$email",
        `"${userData.email || ""}"`
      );
    setQuery(newGet_Registerd_User_By_Email_Query);
    setQueryType("Get_Registerd_User_By_Email_Query");
  };

  const registerResult = (data) => {
    // Checking if user is already registered
    if (data) {
      NotificationConfig.warning("User already registered. Please Login");
      setIsLoading(false);
    } else {
      if (registerData.email.includes("@happiestminds.com")) {
        const query = JSON.stringify({
          query: `mutation MyMutation {
          insert_ss_registeredUsers_one(object: {confirmPassword: "${registerData.confirmPassword}", email: "${registerData.email}", password: "${registerData.password}", address: "${registerData.address}", wish: "${registerData.wish}"}) {
            confirmPassword
            email
            password
            address
            wish
          }
        }
        `,
        });

        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret":
              "OkSFKkndGHnmSl6x2ePbxuiW6wNcyfHR86e7Va6K1RmnLq9udZEYR8ECadLNfsjM",
          },
          body: query,
        }).then((response) => {
          if (response.status >= 400) {
            throw new Error("Error fetching data");
          } else {
            NotificationConfig.success("User registered successfully");
            navigate("/login");
            setIsLoading(false);
            return response.json();
          }
        });
      } else {
        NotificationConfig.error(
          "Registeration failed. Not a Happiest Minds Employee"
        );
        setIsLoading(false);
      }
    }
  };

  const handleLogout = () => {
    // Logout handler
    // Remove user data from local storage
    localStorage.removeItem("user");
    setUser(null);
    setCart([]);
    NotificationConfig.success("User logged out successfully");
  };

  const updatingCart = (cartData) => {
    // Save cartDat to state variable named cart
    setCart(cartData);
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUser"));
    registeredUsers.map((item) => {
      if (item.username === user.username && item.password === user.password)
        item["carts"] = cartData;
    });
    // Update registeredUser data to local storage
    localStorage.setItem("registeredUser", JSON.stringify(registeredUsers));
  };

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          !user ? (
            <Navigate to="/login" />
          ) : (
            <Dashboard
              user={user}
              namesList={namesList}
              endpoint={endpoint}
              Names_Get_Query={Names_Get_Query}
            />
          )
        }
      />
      <Route
        path="/cart"
        element={
          user ? (
            <Cart
              user={user}
              onLogout={handleLogout}
              cart={cart}
              setCartData={updatingCart}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/register"
        element={
          !user ? (
            <RegistrationForm
              onRegister={handleRegister}
              isLoading={isLoading}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/email-verification"
        element={!user ? <EmailVerification /> : <Navigate to="/" />}
      />
      <Route
        path="/forgot-password"
        element={!user ? <ForgotPassword /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={
          !user ? (
            <LoginForm onLogin={handleLogin} isLoading={isLoading} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
};

export default App;
