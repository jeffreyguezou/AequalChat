import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { useDispatch } from "react-redux";
import { AppSliceActions } from "../store/appSlice";
import { WebSocketContext } from "../context/WebSocketContext";
import { SelectedUserContext } from "../context/SelectedUserContext";

interface UserDisaplayDivType {
  userID: string;
  type: string;
  onClick: (id: string, username: string) => void;
}

const UserDisplayDiv = ({ userID, type, onClick }: UserDisaplayDivType) => {
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [userBio, setUserBio] = useState("");

  const dispatch = useDispatch();

  const { id } = useContext(UserContext);

  const WS = useContext(WebSocketContext);
  const SelectedUser = useContext(SelectedUserContext);

  console.log(userID);

  async function getData() {
    const { data } = await axios.get(`/user/getUserDetails/${userID}`);
    if (data) {
      setUserName(data.username);
      setUserProfile(data.profile);
      setUserBio(data.bio);
    }
  }
  if (userID) {
    getData();
  }

  const clickhandler = (id: string, username: string) => {
    SelectedUser.setSelectedUserId(id);
    SelectedUser.setSelectedUserName(username);
    SelectedUser.setSelectedUserBio(userBio);
    SelectedUser.setSelectedUserProfile(userProfile);
    console.log(SelectedUser);
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

  return (
    <div
      onClick={() => {
        clickhandler(userID, userName);
      }}
      className="border-b my-2 p-1 cursor-pointer flex gap-2 items-center"
    >
      <img className="h-8 w-8 rounded-full" src={userProfile}></img>
      <div className="flex w-full p-2 justify-between">
        {userName}{" "}
        {type === "request" && (
          <button
            onClick={acceptRequestHandler}
            className="border p-1 rounded-sm"
          >
            Accept
          </button>
        )}
      </div>
    </div>
  );
};
export default UserDisplayDiv;
