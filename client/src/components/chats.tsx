import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import ChatWindow from "./chatWindow";
import ContactWindow from "./contactWindow";
import { LeftDisplayContext } from "../context/LeftDisplayContext";
import Optionnav from "./optionNav";
import Profile from "./profile";
import { useDispatch } from "react-redux";
import { AppSliceActions } from "../store/appSlice";
import Friends from "./friends";
import { WebSocketContext } from "../context/WebSocketContext";

const Chats = () => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [currentTab, setCurrentTab] = useState("");

  const WS = useContext(WebSocketContext);

  const user = useContext(UserContext);
  let userName = user.userName;
  const activeTabSetter = useContext(LeftDisplayContext);
  const dispath = useDispatch();

  useEffect(() => {
    WS.connectToWs();
  }, []);

  useEffect(() => {
    async function getCurrentUser() {
      const currentUser = await axios.post("/user/getUserDetails", {
        userName,
      });
      if (currentUser) {
        user.setDark(currentUser.data.preferences);
        dispath(AppSliceActions.setUser(currentUser.data));
      }
    }
    getCurrentUser();
  }, [userName]);

  const onUserSelect = (id: string, username: string) => {
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
        {currentTab === "friends" && <Friends />}
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
          onSendReq={(recipient) => WS.sendReqHandler(recipient)}
        />
      </div>
    </div>
  );
};
export default Chats;
