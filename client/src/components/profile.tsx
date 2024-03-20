import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppSliceActions } from "../store/appSlice";
import { WebSocketContext } from "../context/WebSocketContext";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router";

const Profile = () => {
  const [isDisabled, setIsDisabled] = useState(true);

  const [bio, setBio] = useState("");

  const WS = useContext(WebSocketContext);
  const { setUserName, setId, dark, setDark } = useContext(UserContext);

  let currentUser = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const pp = document.querySelector("#profileImg") as HTMLElement;
    pp.style.backgroundImage = `url("${currentUser[0].profile}")`;
    setBio(currentUser[0].bio);
  }, [currentUser]);

  const imageSelectHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const file = event.currentTarget.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("loadend", async (event) => {
      let URL = event!.target!.result;
      const res = await axios.post("/user/uploadUserProfile", { URL });

      if (res) {
        if (res.data.status == "success") {
          alert("Uploaded successfully");
          const pp = document.querySelector("#profileImg") as HTMLElement;
          pp.style.backgroundImage = `url("${res.data.data.imageUrl}")`;

          dispatch(AppSliceActions.updateProfile(res.data.data.imageUrl));
          const imgUpdateRes = await axios.post("/user/updateUserProfileImg", {
            id: currentUser[0]._id,
            profile: res.data.data.imageUrl,
          });
          if (imgUpdateRes) {
            alert("saved in db");
          }
        }
      }
    });
  };

  const bioChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setBio(event.currentTarget.value);
  };

  const saveBioHandler = async () => {
    dispatch(AppSliceActions.updateBio(bio));
    const bioUpdateRes = await axios.post("/user/updateUserBio", {
      id: currentUser[0]._id,
      bio: bio,
    });
    if (bioUpdateRes) {
      console.log("updated");
    }
  };

  const logoutHandler = async () => {
    WS.setWs(null);
    setUserName("");
    setId("");
    const logoutMsg = await axios.post("/auth/logout");
    if (logoutMsg.data === "ok") {
      navigate("/");
    }
  };

  const themeChangeHandler = async (event) => {
    setDark(event.target.value);
    const prefUpdate = await axios.post("user/updatePref", {
      id: currentUser[0]._id,
      preference: event.target.value,
    });
    if (prefUpdate) {
      console.log(prefUpdate.data);
    }
  };

  return (
    <div className="flex-grow flex flex-col gap-4 items-center justify-center">
      <div className="">
        <div
          id="profileImg"
          className="border bg-cover flex flex-col h-40 w-40 rounded-full"
        >
          <div className="flex h-full justify-end items-end flex-wrap">
            <div className="m-1 p-1 z-10 dark:bg-slate-500 bg-gray-200 border rounded-lg">
              <label className="cursor-pointer">
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
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                  />
                </svg>
                <input
                  onChange={imageSelectHandler}
                  type="file"
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <label>Bio</label>
        <input
          className="dark:bg-slate-600 p-1"
          value={bio}
          type="text"
          onChange={bioChangeHandler}
          disabled={isDisabled}
        ></input>
        <div
          onClick={() => {
            setIsDisabled((prev) => {
              return !prev;
            });
          }}
          className="cursor-pointer dark:text-slate-100"
        >
          {isDisabled && (
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          )}
          {!isDisabled && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-green-500"
              onClick={saveBioHandler}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="flex gap-5">
        <label>Theme</label>
        <div>
          <input
            onChange={themeChangeHandler}
            type="radio"
            value="dark"
            name="dark"
            checked={dark === "dark"}
          ></input>
          <label>DARK</label>
        </div>
        <div>
          <input
            onChange={themeChangeHandler}
            type="radio"
            value="light"
            name="light"
            checked={dark === "light"}
          ></input>
          <label>LIGHT</label>
        </div>
      </div>

      <button
        onClick={logoutHandler}
        className="border p-1 rounded-lg hover:bg-slate-200 hover:text-gray-900"
      >
        Log out
      </button>
    </div>
  );
};
export default Profile;
