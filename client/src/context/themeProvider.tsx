import { ReactNode, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { useContext } from "react";
import axios from "axios";

type ThemeProviderrType = {
  children: ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderrType) => {
  const [dark, setDark] = useState("");
  //const { dark } = useContext(UserContext);

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
    if (dark === "dark") {
      document.querySelector("#themeProvider")?.classList.add("dark");
    }
  }, [dark]);

  return (
    <div id="themeProvider" className="h-full">
      {children}
    </div>
  );
};

export default ThemeProvider;
