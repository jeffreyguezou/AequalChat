// useTheme.js
import { useEffect, useState } from "react";

function useTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkTheme(darkThemeQuery.matches);
  }, []);

  return isDarkTheme;
}

export default useTheme;
