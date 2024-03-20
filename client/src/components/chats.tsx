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
import { WebSocketContext } from "../context/WebSocketContext";
import ChatHistory from "./ChatHistory";
import { SelectedUserContext } from "../context/SelectedUserContext";

const Chats = () => {
  const [currentTab, setCurrentTab] = useState("");
  const [loggedInUserFriends, setLoggedInUserFriends] = useState([]);
  const [isUserSelected, setUserSelected] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const smBreakPt = 640;
  const [right, setRight] = useState(
    "w-full sm:w-3/5 h-screen flex flex-col bg-slate-100 dark:bg-slate-800 dark:text-gray-100"
  );
  const [left, setLeft] = useState(
    "w-full sm:w-2/5 flex flex-col bg-slate-200 dark:bg-slate-900 dark:text-gray-100"
  );
  const WS = useContext(WebSocketContext);

  const user = useContext(UserContext);
  let userName = user.userName;
  const activeTabSetter = useContext(LeftDisplayContext);
  const dispath = useDispatch();

  let userArr = useSelector((state) => state.app);
  const { selectedUserId } = useContext(SelectedUserContext);

  let userDeets = userArr[0];

  useEffect(() => {
    WS.connectToWs();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    async function getCurrentUser() {
      const currentUser = await axios.post("/user/getUserDetails", {
        userName,
      });
      if (currentUser) {
        user.setDark(currentUser.data.preferences);
        dispath(AppSliceActions.setUser(currentUser.data));
        setLoggedInUserFriends(currentUser.data.friends);
      }
    }
    getCurrentUser();
  }, [userName]);

  useEffect(() => {
    if (userDeets) {
      setLoggedInUserFriends(userDeets.friends);
    }
  }, [userDeets]);

  useEffect(() => {
    setCurrentTab(activeTabSetter.activeTab);
  }, [activeTabSetter.activeTab]);

  useEffect(() => {
    if (selectedUserId) {
      setUserSelected(true);
    } else {
      setUserSelected(false);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (width < smBreakPt) {
      if (isUserSelected) {
        console.log(window.innerWidth);
        setLeft(
          "hidden s:w-2/5 h-screen flex flex-col  dark:bg-slate-800 dark:text-gray-100"
        );
        setRight(
          "w-screen s:w-3/5 h-screen flex flex-col  dark:bg-slate-800 dark:text-gray-100"
        );
      } else {
        setRight(
          "hidden sm:w-3/5 h-screen flex flex-col  dark:bg-slate-800 dark:text-gray-100"
        );
        setLeft(
          "w-screen sm:w-2/5 h-screen flex flex-col  dark:bg-slate-800 dark:text-gray-100"
        );
      }
    } else {
      setLeft(
        "w-screen sm:w-2/5 h-screen flex flex-col  dark:bg-slate-800 dark:text-gray-100"
      );
      setRight(
        "w-screen s:w-3/5 h-screen flex flex-col  dark:bg-slate-800 dark:text-gray-100"
      );
    }
  }, [isUserSelected, width]);

  return (
    <div className="flex ">
      <div className={left}>
        {currentTab === "search" && <ContactWindow />}
        {currentTab === "friends" && <Friends />}
        {currentTab === "profile" && <Profile />}
        {currentTab === "chats" && (
          <ChatHistory friends={loggedInUserFriends} />
        )}
        <div className="hidden sm:block">
          <Optionnav />
        </div>
      </div>
      <div className={right}>
        <ChatWindow onSendReq={(recipient) => WS.sendReqHandler(recipient)} />
      </div>
    </div>
  );
};
export default Chats;
