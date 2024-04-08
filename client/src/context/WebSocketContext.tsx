import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppSliceActions } from "../store/appSlice";
import { useContext } from "react";
import { UserContext } from "./userContext";
import axios from "axios";
import { SelectedUserContext } from "./SelectedUserContext";
import { fetchMsgs } from "../store/messageSlice";
import { AppDispatch } from "../store/store";

export const WebSocketContext = createContext({} as WSContextType);

type WSContextPropType = {
  children: ReactNode;
};

type WSContextType = {
  connectToWs: () => void;
  sendReqHandler: (recipient: string) => void;
  wsUserDetailsUpdateHandler: (recipient: string) => void;
  setWs: React.Dispatch<React.SetStateAction<WebSocket | null | undefined>>;
  sendMsgHandler: (message: string, recipient: string) => void;
  setTypingHandler: (recipient: string, text: string) => void;
  audioSendHandler: (message, recipient) => void;
};

export function WebSocketContextProvider({ children }: WSContextPropType) {
  const [ws, setWs] = useState<WebSocket | null>();
  const dispath = useDispatch<AppDispatch>();
  const user = useContext(UserContext);
  const selectedUser = useContext(SelectedUserContext);
  const userIDref = useRef("");
  const loggedInUserNameref = useRef("");
  const appData = useSelector((state) => state.app);

  let loggedInUser = appData[0];
  console.log(loggedInUser);

  useEffect(() => {
    userIDref.current = selectedUser.selectedUserId;
  }, [selectedUser]);

  useEffect(() => {
    if (loggedInUser) {
      loggedInUserNameref.current = loggedInUser.username;
    }
  }, [loggedInUser]);

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
    ws.onmessage = (event) => {
      handleMessage(event);
    };
    ws.addEventListener("close", () => {
      setTimeout(() => {
        connectToWs();
      }, 1000);
    });
  }

  const handleMessage = async (event: { data: string }) => {
    const msgData = JSON.parse(event.data);
    if (msgData.type === "request") {
      dispath(AppSliceActions.newRequest(msgData.sender));
    } else if (msgData.type === "userObjectUpdated") {
      const userDetailsUpdatedHandler = async () => {
        const latestUserDetails = await axios.post("/user/getUserDetails", {
          userName: loggedInUserNameref.current,
        });
        if (latestUserDetails) {
          dispath(AppSliceActions.updateUser(latestUserDetails.data));
        }
      };
      await userDetailsUpdatedHandler();
    } else if (msgData.type === "message" || msgData.type === "audiomessage") {
      dispath(fetchMsgs({ current: msgData.recipient, other: msgData.sender }));
      dispath(AppSliceActions.newMessage(msgData.sender));
    } else if (msgData.type === "status") {
      if (userIDref.current === msgData.sender) {
        selectedUser.setSelectedUserStatus(() => msgData.text);
      }
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
      }
    }
    sendReqToDB();
  };

  const sendMsgHandler = (message: string, recipient: string) => {
    ws?.send(
      JSON.stringify({
        recipient,
        sender: user.id,
        type: "message",
        text: message,
      })
    );
    dispath(fetchMsgs({ current: user.id, other: recipient }));
    const updateUnreadHandler = async () => {
      const unreadUpdated = await axios.post("/user/updateUnread", {
        recieverID: recipient,
        senderID: user.id,
      });
    };
    updateUnreadHandler();
  };

  const audioSendHandler = async (message, recipient) => {
    let reader = new FileReader();
    let b64Data;
    reader.readAsDataURL(message);
    reader.onloadend = async () => {
      b64Data = reader.result;

      ws?.send(
        JSON.stringify({
          recipient,
          sender: user.id,
          type: "audiomessage",
          text: b64Data,
        })
      );

      const updateUnreadHandler = async () => {
        const unreadUpdated = await axios.post("/user/updateUnread", {
          recieverID: recipient,
          senderID: user.id,
        });
        if (unreadUpdated) {
          return "updated";
        }
      };
      updateUnreadHandler();
    };
    dispath(fetchMsgs({ current: user.id, other: recipient }));
  };

  const wsUserDetailsUpdateHandler = (recipient: string) => {
    ws?.send(
      JSON.stringify({
        recipient,
        type: "userObjectUpdated",
        text: "",
      })
    );
    const userDetailsUpdatedHandler = async () => {
      const latestUserDetails = await axios.post("/user/getUserDetails", {
        userName: user.userName,
      });
      if (latestUserDetails) {
        dispath(AppSliceActions.updateUser(latestUserDetails.data));
      }
    };
    userDetailsUpdatedHandler();
  };

  const setTypingHandler = async (recipient: string, text: string) => {
    ws?.send(
      JSON.stringify({
        recipient,
        text,
        type: "status",
      })
    );
  };

  let providerVal: WSContextType = {
    connectToWs,
    sendReqHandler,
    wsUserDetailsUpdateHandler,
    setWs,
    sendMsgHandler,
    setTypingHandler,
    audioSendHandler,
  };

  return (
    <WebSocketContext.Provider value={providerVal}>
      {children}
    </WebSocketContext.Provider>
  );
}
