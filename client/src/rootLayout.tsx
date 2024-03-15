import { Outlet } from "react-router";
import Chats from "./components/chats";

const RootLayout = () => {
  return (
    <div className="flex w-full h-full content-between">
      <Chats />
      <Outlet />
    </div>
  );
};
export default RootLayout;
