import React, { useContext, useEffect, useState } from "react";
import CenterAligner from "../elements/centerAligner";
import FloatingInput from "../elements/floatingInput";
import HeaderLogo from "../elements/headerLogo";
import { useNavigate } from "react-router";
import axios from "axios";
import { UserContext } from "../context/userContext";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const loginHandler = async () => {
    const loggedInUser = await axios.post("/auth/login", {
      username: userName,
      password,
    });
    if (loggedInUser) {
      console.log(loggedInUser);
      if (loggedInUser.data.id) {
        userContext.setUserName(userName);
        userContext.setId(loggedInUser.data.id);
        navigate("/chats");
      } else if (loggedInUser.data === "No user found") {
        alert("No user found");
        setUserNameError(true);
      } else if (loggedInUser.data === "invalid password") {
        alert("Invalid password");
        setPasswordError(true);
      }
    }
  };

  const nameChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
    setUserNameError(false);
  };

  const passwordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
    setPasswordError(false);
  };

  return (
    <CenterAligner>
      <HeaderLogo />
      <div className="w-2/3">
        <FloatingInput
          labelName="User Name"
          type="text"
          onChange={nameChangeHandler}
          value={userName}
          error={userNameError.toString()}
        ></FloatingInput>
        <FloatingInput
          labelName="Password"
          type="password"
          onChange={passwordChangeHandler}
          error={passwordError.toString()}
        ></FloatingInput>
      </div>
      <div className="mx-2 my-3 text-center flex flex-col items-center">
        <button
          onClick={loginHandler}
          className="bg-slate-400 p-2 rounded-lg w-full  hover:rounded-full hover:bg-blue-400 hover:font-bold text-white text-bold"
        >
          Login
        </button>
        <span>
          New user?{" "}
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            Register
          </button>{" "}
          Here
        </span>
      </div>
    </CenterAligner>
  );
};
export default Login;
