import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import ChatWindow from "./chatWindow";
import ContactWindow from "./contactWindow";

const Chats = () => {
  const [ws, setWs] = useState<WebSocket | null>();

  const user = useContext(UserContext);
  let userName = user.userName;

  useEffect(() => {
    async function getCurrentUser() {
      const currentUser = await axios.post("/user/getUserDetails", {
        userName,
      });
      if (currentUser) {
        user.setDark(currentUser.data.preferences);
      }
    }
    getCurrentUser();
  }, []);

  useEffect(() => {
    connectToWS();
  }, []);

  const connectToWS = () => {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
  };

  return (
    <div className="flex ">
      <div className="w-2/5 h-screen  dark:bg-slate-900 dark:text-gray-100">
        <ContactWindow />
      </div>
      <div className="w-3/5 h-screen flex flex-col  dark:bg-slate-800 dark:text-gray-100">
        <ChatWindow />
      </div>
    </div>
  );
};
export default Chats;
