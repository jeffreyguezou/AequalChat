import { ReactNode, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { useContext } from "react";
import axios from "axios";

type ThemeProviderrType = {
  children: ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderrType) => {
  const [dark, setDark] = useState("");
  const userContext = useContext(UserContext);

  const { id } = useContext(UserContext);

  useEffect(() => {
    async function fetchCurrent() {
      if (id) {
        const currentUser = await axios.get(`/user/getCurrentUser/${id}`);
        if (currentUser) {
          setDark(currentUser.data.preferences);
        }
      }
    }
    fetchCurrent();
  }, [id]);

  useEffect(() => {
    setDark(userContext.dark);
  }, [userContext.dark]);

  useEffect(() => {
    if (dark === "dark") {
      document.querySelector("#themeProvider")?.classList.add("dark");
    } else {
      document.querySelector("#themeProvider")?.classList.remove("dark");
      document.querySelector("#themeProvider")?.classList.add("light");
    }
  }, [dark]);

  return (
    <div id="themeProvider" className="h-full">
      {children}
    </div>
  );
};

export default ThemeProvider;
