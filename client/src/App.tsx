import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Register from "./components/register";
import axios from "axios";
import Login from "./components/login";
import Chats from "./components/chats";
import { UserContextProvider } from "./context/userContext";
import ThemeProvider from "./context/themeProvider";

function App() {
  axios.defaults.baseURL = "http://localhost:4040";
  axios.defaults.withCredentials = true;

  const router = createBrowserRouter([
    { path: "/", element: <Register /> },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/chats",
      element: <Chats />,
    },
  ]);
  return (
    <>
      <UserContextProvider>
        <ThemeProvider>
          <RouterProvider router={router}></RouterProvider>
        </ThemeProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
