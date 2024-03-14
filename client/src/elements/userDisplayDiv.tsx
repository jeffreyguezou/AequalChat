import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { useDispatch } from "react-redux";
import { AppSliceActions } from "../store/appSlice";
import { WebSocketContext } from "../context/WebSocketContext";

interface UserDisaplayDivType {
  userID: string;
  type: string;
  onClick: (id: string, username: string) => void;
}

const UserDisplayDiv = ({ userID, type, onClick }: UserDisaplayDivType) => {
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState("");

  const dispatch = useDispatch();

  const { id } = useContext(UserContext);

  const WS = useContext(WebSocketContext);

  async function getData() {
    const { data } = await axios.get(`/user/getUserDetails/${userID}`);
    if (data) {
      setUserName(data.username);
      setUserProfile(data.profile);
    }
  }
  if (userID) {
    getData();
  }

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
        onClick(id, userName);
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
