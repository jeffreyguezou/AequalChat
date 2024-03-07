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

  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const loginHandler = async () => {
    const loggedInUser = await axios.post("/auth/login", {
      username: userName,
      password,
    });
    if (loggedInUser) {
      userContext.setUserName(userName);
      userContext.setId(loggedInUser.data.id);
      navigate("/chats");
    }
  };

  const nameChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
  };

  const passwordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
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
        ></FloatingInput>
        <FloatingInput
          labelName="Password"
          type="password"
          onChange={passwordChangeHandler}
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
