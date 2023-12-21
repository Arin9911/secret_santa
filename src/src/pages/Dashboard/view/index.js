import React, { useEffect, useState } from "react";
import Topbar from "../../Topbar/view";
import AddIcon from "../../../assets/plus-solid.svg";
import CardList from "../../../assets/files/CardList.json";
import { NotificationConfig } from "../../../utils/notification/notification";
import "../styles/index.scss";

let Match_Get_Query = `{
  ss_match_by_pk(secretSanta: $secretSanta) {
    secretSanta
    user
    secretSantaEmail
    userEmail
  }
}`;

let Get_Registerd_User_By_Email_Query = `{
  ss_registeredUsers_by_pk(email: $email) {
    confirmPassword
    email
    password
    address
    wish
  }
}`;

const Dashboard = ({ user, namesList, endpoint, Names_Get_Query }) => {
  const [matchList, setMatchList] = useState("null");
  const [isButtonDisable, setIsButtonDisable] = useState(true);
  const [randomNumber, setRandomNumber] = useState(null);
  const [address, setAddress] = useState(null);
  const [wish, setWish] = useState(null);
  const [list, setList] = useState([]);
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  useEffect(() => {
    const newMatch_Get_Query = Match_Get_Query.replace(
      "$secretSanta",
      `"${user.name}"`
    );

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret":
          "OkSFKkndGHnmSl6x2ePbxuiW6wNcyfHR86e7Va6K1RmnLq9udZEYR8ECadLNfsjM",
      },
      body: JSON.stringify({
        query: newMatch_Get_Query,
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
        setMatchList(data.data.ss_match_by_pk || matchList);
        setIsButtonDisable(data.data.ss_match_by_pk ? true : false);
      });
  }, []);

  useEffect(() => {
    const newGet_Registerd_User_By_Email_Query =
      Get_Registerd_User_By_Email_Query.replace(
        "$email",
        `"${matchList.userEmail}"`
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
        // console.log("Registered user", data.data.ss_registeredUsers_by_pk);
        if (data.data.ss_registeredUsers_by_pk) {
          setAddress(data.data.ss_registeredUsers_by_pk?.address);
          setWish(data.data.ss_registeredUsers_by_pk?.wish);
          setIsUserRegistered(true);
        } else {
          setIsUserRegistered(false);
        }
      });
  }, [matchList.secretSanta]);

  useEffect(() => {
    if (!namesList && matchList === "null") {
      console.log("adf");
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret":
            "OkSFKkndGHnmSl6x2ePbxuiW6wNcyfHR86e7Va6K1RmnLq9udZEYR8ECadLNfsjM",
        },
        body: JSON.stringify({
          query: Names_Get_Query,
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
          setList(
            data?.data?.ss_users.filter((item) => item.email != user.email)
          );
        });
    } else setList(namesList.filter((item) => item.email != user.email));

    // console.log("list -", list);
  }, [namesList, matchList]);

  const onButtonClick = () => {
    setIsButtonDisable(true);
    const randomNo = Math.floor(Math.random() * (list.length - 1) + 1);
    setRandomNumber(randomNo);
    const selUser = list[randomNo]?.name;
    const selUserEmail = list[randomNo]?.email;

    const query = JSON.stringify({
      query: `mutation MyMutation {
        insert_ss_match(objects: {secretSanta: "${user.name}", user: "${selUser}", secretSantaEmail: "${user.email}", userEmail: "${selUserEmail}"}) {
          affected_rows
          returning {
            secretSanta
            user
            secretSantaEmail
            userEmail
          }
        }
      }`,
    });

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret":
          "OkSFKkndGHnmSl6x2ePbxuiW6wNcyfHR86e7Va6K1RmnLq9udZEYR8ECadLNfsjM",
      },
      body: query,
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Error fetching data");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data?.data?.insert_ss_match) {
          const query = JSON.stringify({
            query: `mutation MyMutation {
              delete_ss_users_by_pk(email: "${list[randomNo]?.email}") {
                address
                email
                name
                wishes
              }
            }`,
          });

          fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret":
                "OkSFKkndGHnmSl6x2ePbxuiW6wNcyfHR86e7Va6K1RmnLq9udZEYR8ECadLNfsjM",
            },
            body: query,
          })
            .then((response) => {
              if (response.status >= 400) {
                throw new Error("Error fetching data");
              } else {
                return response.json();
              }
            })
            .then((data) => {
              if (data.data.delete_ss_users_by_pk)
                NotificationConfig.success("Matching successful");
            });
        }
      });
  };

  return (
    <div className="mainWrapper">
      <audio loop autoplay>
        <source src="path/to/file" type="audio/filetype" />
      </audio>
      <div className="main">
        <div className="secretSantaWrapper">
          <div className="card1 backgroundColor">
            <h3>Secret Santa</h3>
            <p>{user.name}</p>
          </div>
        </div>
        {!isButtonDisable && (
          <button className="revealButton" onClick={onButtonClick}>
            <b>Let's Reveal</b>
          </button>
        )}
        {console.log("isUserRegistered -", isUserRegistered)}
        {console.log("matchList -", matchList)}
        {console.log("randomNumber -", randomNumber)}
        <div className="userWrapper">
          {matchList?.secretSanta ? (
            <div className="userDetailsWrapper marginBottom50">
              <h3>Wish: </h3>
              <span>{isUserRegistered ? wish : "Data not updated"}</span>
            </div>
          ) : (
            randomNumber && (
              <div className="userDetailsWrapper marginBottom50">
                <h3>Wish: </h3>
                <span>{isUserRegistered ? wish : "Data not updated"}</span>
              </div>
            )
          )}
          {matchList?.secretSanta ? (
            <div className="card1">
              <p>{matchList?.user}</p>
            </div>
          ) : randomNumber ? (
            <div className="card1">
              <p>{list[randomNumber]?.name}</p>
            </div>
          ) : (
            <div className="card1 hidden"></div>
          )}
          {matchList?.secretSanta ? (
            <div className="userDetailsWrapper marginTop50">
              <h3>Address: </h3>
              <span>{isUserRegistered ? address : "Data not updated"}</span>
            </div>
          ) : (
            randomNumber && (
              <div className="userDetailsWrapper marginTop50">
                <h3>Address: </h3>
                <span>{isUserRegistered ? address : "Data not updated"}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
