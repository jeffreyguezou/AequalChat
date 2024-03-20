import React, { useContext, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { SelectedUserContext } from "../context/SelectedUserContext";
import { WebSocketContext } from "../context/WebSocketContext";
import { IRootState } from "../store/store";
import Optionnav from "./optionNav";

type ChatWindowProps = {
  onSendReq: (recipient: string) => void;
};

const ChatWindow = ({ onSendReq }: ChatWindowProps) => {
  const [isFriend, setIsFriend] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [iterableMsgs, setiterableMsgs] = useState([]);

  const selectedUser = useContext(SelectedUserContext);
  const WS = useContext(WebSocketContext);
  const userArray = useSelector((state: IRootState) => state.app);
  const divUnderMessages = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (userArray[0]) {
      let userFriends = userArray[0].friends;
      if (userFriends.includes(selectedUser.selectedUserId)) {
        setIsFriend(true);
      } else {
        setIsFriend(false);
      }
    }
  }, [userArray, selectedUser]);

  const msgTextChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setMsgText(event.currentTarget.value);
  };

  const msgInputFocusHandler = () => {
    WS.setTypingHandler(selectedUser.selectedUserId, "typing");
  };

  const msgRemoveFocusHandler = () => {
    WS.setTypingHandler(selectedUser.selectedUserId, "");
  };

  const sendMsgHandler = () => {
    WS.sendMsgHandler(msgText, selectedUser.selectedUserId);
    setMsgText("");
  };

  let msgDet = useSelector((state: IRootState) => state.messages);
  useEffect(() => {
    if (msgDet) {
      setiterableMsgs(msgDet[selectedUser.selectedUserId]);
    }
  }, [msgDet]);

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [iterableMsgs]);

  return (
    <>
      {selectedUser.selectedUserId && (
        <>
          <div className="flex-grow flex flex-col overflow-y-auto">
            <div className="p-2 flex gap-2 bg-slate-700 text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer hover:bg-slate-500"
                onClick={() => {
                  selectedUser.resetSelectedUser();
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>

              <img
                className="h-6 w-6 rounded-full"
                src={selectedUser.selectedUserProfile}
              ></img>

              <h1>{selectedUser.selectedUserName}</h1>
              <h4 className="italic font-extralight">
                {selectedUser.selectedUserStatus}
              </h4>
              <div className="text-right flex-grow italic">
                <h3>{selectedUser.selectedUserBio}</h3>
              </div>
            </div>
            {!isFriend && (
              <div className="flex flex-grow items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  onClick={() => onSendReq(selectedUser.selectedUserId)}
                  className="h-6 w-6 border-slate-300 border cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
              </div>
            )}
            {isFriend && iterableMsgs && (
              <div className="overflow-y-auto">
                {iterableMsgs.map((msg) => {
                  {
                    if (msg.sender === selectedUser.selectedUserId) {
                      return (
                        <div
                          key={msg._id}
                          className="bg-slate-600 p-2 rounded-lg m-2 lg:w-1/3 w-2/3 mr-auto"
                        >
                          {msg.text}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={msg._id}
                          className="bg-lime-800 p-2 rounded-lg w-2/3 lg:w-1/3 m-2 ml-auto"
                        >
                          {msg.text}
                        </div>
                      );
                    }
                  }
                })}
                <div ref={divUnderMessages}></div>
              </div>
            )}
          </div>
          {isFriend && (
            <div className="flex m-4 gap-4 items-center">
              <input
                onFocus={msgInputFocusHandler}
                onBlur={msgRemoveFocusHandler}
                className="p-2 flex-grow dark:text-slate-900"
                type="text"
                placeholder="type your message"
                onChange={msgTextChangeHandler}
                value={msgText}
              ></input>
              <button
                onClick={sendMsgHandler}
                className="text-center border border-gray-50 p-1 hover:bg-slate-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
      <div
        className="block sm:hidden
      "
      >
        <Optionnav />
      </div>
      {!selectedUser.selectedUserId && (
        <div>Select a user to start chaetting</div>
      )}
    </>
  );
};
export default ChatWindow;
