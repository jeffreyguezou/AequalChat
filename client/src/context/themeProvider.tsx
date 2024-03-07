import { ReactNode, useEffect } from "react";
import { UserContext } from "./userContext";
import { useContext } from "react";

type ThemeProviderrType = {
  children: ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderrType) => {
  const { dark } = useContext(UserContext);

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
