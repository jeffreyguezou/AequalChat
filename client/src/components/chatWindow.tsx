import React, { useContext, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectedUserContext } from "../context/SelectedUserContext";
import { WebSocketContext } from "../context/WebSocketContext";
import { IRootState } from "../store/store";
import { AppSliceActions } from "../store/appSlice";

type ChatWindowProps = {
  onSendReq: (recipient: string) => void;
};

const ChatWindow = ({ onSendReq }: ChatWindowProps) => {
  const [isFriend, setIsFriend] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [iterableMsgs, setiterableMsgs] = useState([]);
  const [isSentReq, setIsSentReq] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [isAudioChunkExist, setIsAudioChunkExist] = useState(false);
  const [audioSRC, setAudioSrc] = useState("");
  const [sendableBlob, setSendableBlob] = useState<Blob | null>();

  const selectedUser = useContext(SelectedUserContext);
  const WS = useContext(WebSocketContext);
  const userArray = useSelector((state: IRootState) => state.app);
  const divUnderMessages = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  let chunkRef = useRef<Blob[] | null>();

  useEffect(() => {
    if (userArray[0]) {
      let userFriends = userArray[0].friends;
      let userRequests = userArray[0].sentRequests;
      if (userFriends.includes(selectedUser.selectedUserId)) {
        setIsFriend(true);
      } else {
        setIsFriend(false);
      }
      if (userRequests.includes(selectedUser.selectedUserId)) {
        setIsSentReq(true);
      } else {
        setIsSentReq(false);
      }
    }
    console.log(userArray[0]);
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

  useEffect(() => {
    console.log("Audio chunk changed", audioChunks);
    chunkRef.current = audioChunks;
    console.log(isAudioChunkExist);
  }, [audioChunks]);

  let msgDet = useSelector((state: IRootState) => state.messages);
  useEffect(() => {
    if (msgDet) {
      setiterableMsgs(msgDet[selectedUser.selectedUserId]);
    }
    console.log(msgDet);
  }, [msgDet]);

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [iterableMsgs]);

  /*   const audioClickHandler = async () => {
    setIsRecording(() => {
      return !isRecording;
    });
    if (!isRecording) {
      let mediaDevicesStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (mediaDevicesStream) {
        const recorder = new MediaRecorder(mediaDevicesStream);
        recorder.ondataavailable = (e) => {
          console.log("data available");
          setAudioChunks((prev) => [...prev, e.data]);
          console.log("changing audio chunk");
          setIsAudioChunkExist(true);
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          console.log(typeof audioBlob);
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioSrc(audioUrl);
          const saveBlob = () => {
            console.log("entered save blob", audioChunks);

            if (audioChunks.length === 0) {
              console.error("No audio data to play.");
              return;
            }
          };
          //saveBlob();
        };
        recorder.start();
        mediaRecorder.current = recorder;
      }
    } else {
      console.log("record ended");
      mediaRecorder.current?.stop();
    }
  }; */

  const audioClickHandler = async () => {
    setIsRecording((prev) => !prev); // Toggle the recording state

    if (!isRecording) {
      // If starting recording
      try {
        const mediaDevicesStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const recorder = new MediaRecorder(mediaDevicesStream);
        const chunks = []; // Store audio data chunks

        recorder.ondataavailable = (e) => {
          console.log("data available");
          chunks.push(e.data); // Push new chunk to array
          setIsAudioChunkExist(true);
        };

        recorder.onstop = () => {
          console.log("recording stopped");
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          setSendableBlob(audioBlob);
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioSrc(audioUrl);
        };

        recorder.start();
        mediaRecorder.current = recorder; // Save recorder reference
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    } else {
      mediaRecorder.current?.stop();
    }
  };

  const sendAudioHandler = () => {
    let audioSent = WS.audioSendHandler(
      sendableBlob,
      selectedUser.selectedUserId
    );
    setIsRecording(false);
    setIsAudioChunkExist(false);
    console.log(Promise.resolve(audioSent));
  };

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
            {!isFriend && !isSentReq && (
              <div className="flex flex-grow items-center justify-center">
                {isSentReq}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  onClick={() => {
                    dispatch(
                      AppSliceActions.sentRequest(selectedUser.selectedUserId)
                    );
                    onSendReq(selectedUser.selectedUserId);
                  }}
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
            {!isFriend && isSentReq && (
              <div className="flex h-full items-center justify-center">
                Sent request. Waiting for user to accept.
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
                          className="dark:bg-slate-600 text-slate-800 dark:text-slate-100 bg-slate-300 p-2 rounded-lg m-2 lg:w-1/3 w-2/3 mr-auto"
                        >
                          {msg.type === "message" && <span>{msg.text}</span>}
                          {msg.type === "audiomessage" && (
                            <audio controls>
                              <source src={msg.text}></source>
                            </audio>
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={msg._id}
                          className="dark:bg-lime-800  text-slate-800 dark:text-slate-100 bg-lime-200 p-2 rounded-lg w-2/3 lg:w-1/3 m-2 ml-auto"
                        >
                          {msg.type === "message" && <span>{msg.text}</span>}
                          {msg.type === "audiomessage" && (
                            <audio controls>
                              <source src={msg.text}></source>
                            </audio>
                          )}
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
              {!isAudioChunkExist && (
                <input
                  onFocus={msgInputFocusHandler}
                  onBlur={msgRemoveFocusHandler}
                  className="p-2 flex-grow dark:text-slate-900"
                  type="text"
                  placeholder="type your message"
                  onChange={msgTextChangeHandler}
                  value={msgText}
                ></input>
              )}
              {isAudioChunkExist && (
                <audio className="flex-grow" controls>
                  <source src={audioSRC} />
                </audio>
              )}
              {!isRecording && (
                <button
                  onClick={audioClickHandler}
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
                      d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                    />
                  </svg>
                </button>
              )}
              {isRecording && (
                <button
                  onClick={audioClickHandler}
                  className="text-center border border-gray-50 p-1 hover:bg-slate-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                    />
                  </svg>
                </button>
              )}
              {!isAudioChunkExist && (
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
              )}
              {isAudioChunkExist && (
                <button
                  onClick={sendAudioHandler}
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
              )}
            </div>
          )}
        </>
      )}
      {!selectedUser.selectedUserId && (
        <div>Select a user to start chaetting</div>
      )}
    </>
  );
};
export default ChatWindow;
