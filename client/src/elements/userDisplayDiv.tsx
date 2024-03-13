import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { useDispatch } from "react-redux";
import { AppSliceActions } from "../store/appSlice";

type UserDisaplayDivType = {
  userID: string;
};

const UserDisplayDiv = ({ userID }: UserDisaplayDivType) => {
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState("");

  const dispatch = useDispatch();

  const { id } = useContext(UserContext);

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
    console.log(userID);
    const res = await axios.post("/user/acceptReq", {
      id,
      acceptedReqID: userID,
    });
    if (res) {
      if (res.data === "UPDATED FRIENDS IN DB") {
        dispatch(AppSliceActions.acceptRequest(userID));
      }
    }
  };

  return (
    <div className="border-b my-2 p-1 cursor-pointer flex gap-2 items-center">
      <img className="h-8 w-8 rounded-full" src={userProfile}></img>
      <div className="flex w-full p-2 justify-between">
        {userName}{" "}
        <button
          onClick={acceptRequestHandler}
          className="border p-1 rounded-sm"
        >
          Accept
        </button>
      </div>
    </div>
  );
};
export default UserDisplayDiv;
