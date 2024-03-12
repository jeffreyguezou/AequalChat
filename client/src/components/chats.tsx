import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import ChatWindow from "./chatWindow";
import ContactWindow from "./contactWindow";
import { LeftDisplayContext } from "../context/LeftDisplayContext";
import Optionnav from "./optionNav";
import Profile from "./profile";
import { useDispatch, useSelector } from "react-redux";
import { AppSliceActions } from "../store/appSlice";
import Friends from "./friends";

const Chats = () => {
  const [ws, setWs] = useState<WebSocket | null>();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [currentTab, setCurrentTab] = useState("");
  const [requests, setRequests] = useState([]);

  const user = useContext(UserContext);
  let userName = user.userName;
  const activeTabSetter = useContext(LeftDisplayContext);
  const dispath = useDispatch();

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
    console.log("connection est");
    ws.onmessage = (event) => {
      console.log(event);
      const reqdata = JSON.parse(event.data);
      setRequests((prev) => [...prev, { ...reqdata }]);
    };
    ws.addEventListener("close", () => {
      setTimeout(() => {
        connectToWs();
      }, 1000);
    });
  }

  useEffect(() => {
    async function getCurrentUser() {
      const currentUser = await axios.post("/user/getUserDetails", {
        userName,
      });
      if (currentUser) {
        console.log(currentUser);

        user.setDark(currentUser.data.preferences);
        dispath(AppSliceActions.setUser(currentUser.data));
      }
    }
    getCurrentUser();
  }, [userName]);

  useEffect(() => {
    connectToWS();
  }, []);

  const connectToWS = () => {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
  };

  const onUserSelect = (id: string, username: string) => {
    setSelectedUserId(id);
    setSelectedUserName(username);
  };

  const handleMessage = (event: { data: string }) => {
    const msgData = JSON.parse(event.data);
    console.log(msgData);
  };

  const sendReqHandler = (recipient: string) => {
    console.log(recipient);
    ws?.send(
      JSON.stringify({
        recipient,
        sender: user.id,
        type: "request",
        text: "",
      })
    );
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
          onSendReq={(recipient) => sendReqHandler(recipient)}
        />
      </div>
    </div>
  );
};
export default Chats;
