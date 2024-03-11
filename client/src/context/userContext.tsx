import React, { ReactNode, createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext<UserContextType>(
  {} as UserContextType
);

type UserContextType = {
  userName: string;
  id: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  setId: React.Dispatch<React.SetStateAction<string>>;
  dark: string;
  setDark: React.Dispatch<React.SetStateAction<string>>;
};

type UserContextProviderProp = {
  children: ReactNode;
};

export function UserContextProvider({ children }: UserContextProviderProp) {
  const [userName, setUserName] = useState("");
  const [id, setId] = useState("");
  const [dark, setDark] = useState("");

  useEffect(() => {
    axios.get("/user/verifyUserProfile").then((res) => {
      console.log(res);
      setId(res.data.userData.userId);
      setUserName(res.data.userData.username);
      setDark;
    });
  }, []);

  let providerValue: UserContextType = {
    userName,
    setUserName,
    id,
    setId,
    dark,
    setDark,
  };

  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
}
