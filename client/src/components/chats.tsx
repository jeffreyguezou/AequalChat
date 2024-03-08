import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import ChatWindow from "./chatWindow";
import ContactWindow from "./contactWindow";
import { LeftDisplayContext } from "../context/LeftDisplayContext";
import Optionnav from "./optionNav";
import Profile from "./profile";

const Chats = () => {
  const [ws, setWs] = useState<WebSocket | null>();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [currentTab, setCurrentTab] = useState("");

  const user = useContext(UserContext);
  let userName = user.userName;
  const activeTabSetter = useContext(LeftDisplayContext);

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

  const onUserSelect = (id: string, username: string) => {
    console.log("entered");
    setSelectedUserId(id);
    setSelectedUserName(username);
  };

  useEffect(() => {
    setCurrentTab(activeTabSetter.activeTab);
  }, [activeTabSetter.activeTab]);

  return (
    <div className="flex ">
      <div className="w-2/5 flex flex-col dark:bg-slate-900 dark:text-gray-100">
        {currentTab === "search" && (
          <ContactWindow
            onClick={(id, username) => onUserSelect(id, username)}
          />
        )}
        {currentTab === "friends" && <div>friends</div>}
        {currentTab === "profile" && <Profile />}
        {currentTab === "chats" && <div>chats</div>}
        <div>
          <Optionnav />
        </div>
      </div>
      <div className="w-3/5 h-screen flex flex-col  dark:bg-slate-800 dark:text-gray-100">
        <ChatWindow
          selecteduserId={selectedUserId}
          selectedUserName={selectedUserName}
        />
      </div>
    </div>
  );
};
export default Chats;
