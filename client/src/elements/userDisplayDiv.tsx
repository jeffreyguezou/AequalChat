import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { useDispatch, useSelector } from "react-redux";
import { AppSliceActions, updateReadMsg } from "../store/appSlice";
import { WebSocketContext } from "../context/WebSocketContext";
import { SelectedUserContext } from "../context/SelectedUserContext";
import { fetchMsgs } from "../store/messageSlice";
import { AppDispatch } from "../store/store";
import { useQuery } from "@tanstack/react-query";

interface UserDisaplayDivType {
  userID: string;
  type: string;
  onClick: (id: string, username: string) => void;
}

const UserDisplayDiv = ({ userID, type, onClick }: UserDisaplayDivType) => {
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [userBio, setUserBio] = useState("");
  const [unRead, setUnRead] = useState([]);
  const [msgCount, setMsgCount] = useState(0);

  const [enabled, setEnabled] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const { id } = useContext(UserContext);

  const WS = useContext(WebSocketContext);
  const SelectedUser = useContext(SelectedUserContext);

  const { data } = useQuery({
    queryKey: [`${userID}`],
    queryFn: async () => {
      const { data } = await axios.get(`/user/getUserDetails/${userID}`);
      return data;
    },
    enabled: enabled,
  });
  useEffect(() => {
    setEnabled(true);
  }, [userID]);
  useEffect(() => {
    if (data) {
      setUserName(data.username);
      setUserProfile(data.profile);
      setUserBio(data.bio);
    }
  }, [data]);

  let userData = useSelector((state) => state.app);

  useEffect(() => {
    setUnRead(userData[0].unreadMessages);
  }, [userData[0].unreadMessages]);

  useEffect(() => {
    unRead.forEach((msgSender) => {
      if (msgSender == userID) {
        setMsgCount((prev) => {
          return prev + 1;
        });
      }
    });
  }, [unRead, userID]);

  const clickhandler = async (id: string, username: string) => {
    SelectedUser.setSelectedUserId(id);
    SelectedUser.setSelectedUserName(username);
    SelectedUser.setSelectedUserBio(userBio);
    SelectedUser.setSelectedUserProfile(userProfile);
    dispatch(
      updateReadMsg({
        viewedBy: userData[0]._id,
        viewedWhose: userID,
      })
    );
  };

  const acceptRequestHandler = async () => {
    const res = await axios.post("/user/acceptReq", {
      id,
      acceptedReqID: userID,
    });
    if (res) {
      if (res.data === "UPDATED FRIENDS IN DB") {
        dispatch(AppSliceActions.acceptRequest(userID));
        WS.wsUserDetailsUpdateHandler(userID);
      }
    }
  };

  const cancelRequestHandler = async () => {
    const res = await axios.post("/user/rejectRequest", {
      rejectedBy: id,
      rejectedId: userID,
    });
    if (res) {
      if (res.data === "request rejected") {
        dispatch(AppSliceActions.acceptRequest(userID));
        //accept request only removes from request array. can be reused - name is contradictory
        WS.wsUserDetailsUpdateHandler(userID);
      }
    }
  };

  const userDivClickHandler = async () => {
    if (type === "friend") {
      dispatch(fetchMsgs({ current: id, other: userID }));
    }
    clickhandler(userID, userName);
    setMsgCount(0);
  };

  const unfriendConfirmHandler = async (userName: string) => {
    let unFriendConfirm = confirm(
      `Are you sure you want to unfriend ${userName}`
    );
    if (unFriendConfirm) {
      const res = await axios.post("/user/unfriendUser", {
        id,
        unfriendedID: userID,
      });
      if (res) {
        console.log(res.data);
        if (res.data === "updated unfriend") {
          dispatch(AppSliceActions.unfriendUser(userID));
          WS.wsUserDetailsUpdateHandler(userID);
        }
      }
    }
  };

  return (
    <div
      onClick={userDivClickHandler}
      className="border-b  border-slate-400 dark:border-slate-50 my-2 p-1 cursor-pointer flex gap-2 items-center"
    >
      <img className="h-8 w-8 rounded-full" src={userProfile}></img>
      <div className="flex w-full p-2 justify-between">
        {userName}{" "}
        {type === "request" && (
          <div className="flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 border p-1 rounded-sm hover:bg-slate-300 hover:text-green-700"
              onClick={acceptRequestHandler}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 border p-1 rounded-sm hover:bg-slate-300 hover:text-red-700"
              onClick={cancelRequestHandler}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
        {unRead && type === "friend" && (
          <div className="w-6 h-6 rounded-full bg-green-500">
            <div className="text-center">{msgCount}</div>
          </div>
        )}
        {type === "friends" && (
          <div className="border border-gray-700 rounded-sm ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              onClick={() => {
                unfriendConfirmHandler(userName);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserDisplayDiv;
