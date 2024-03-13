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

const Chats = () => {
  const [ws, setWs] = useState<WebSocket | null>();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [currentTab, setCurrentTab] = useState("");

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
      handleMessage(event);
    };
    ws.addEventListener("close", () => {
      setTimeout(() => {
        connectToWs();
      }, 1000);
    });
  }

  console.log(userName);

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
    if (msgData.type === "request") {
      console.log(msgData.sender);
      dispath(AppSliceActions.newRequest(msgData.sender));
    }
  };

  const sendReqHandler = (recipient: string) => {
    ws?.send(
      JSON.stringify({
        recipient,
        sender: user.id,
        type: "request",
        text: "",
      })
    );

    async function sendReqToDB() {
      const sentReq = await axios.post("/user/updateReq", {
        id: recipient,
        reqBy: user.id,
      });
      if (sentReq) {
        console.log(sentReq);
      }
    }

    sendReqToDB();
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
