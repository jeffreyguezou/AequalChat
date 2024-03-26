import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Register from "./components/register";
import axios from "axios";
import React from "react";
import Login from "./components/login";
const Chats = React.lazy(() => import("./components/chats"));
import { UserContextProvider } from "./context/userContext";
import ThemeProvider from "./context/themeProvider";
import { LeftDisplayContextProvider } from "./context/LeftDisplayContext";
import { WebSocketContextProvider } from "./context/WebSocketContext";
import { SelectedUserContextProvider } from "./context/SelectedUserContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

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

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <ThemeProvider>
          <SelectedUserContextProvider>
            <WebSocketContextProvider>
              <LeftDisplayContextProvider>
                <RouterProvider router={router}></RouterProvider>
              </LeftDisplayContextProvider>
            </WebSocketContextProvider>
          </SelectedUserContextProvider>
        </ThemeProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default App;
