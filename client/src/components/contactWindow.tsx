import { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserDisplayDiv from "../elements/userDisplayDiv";
import { SelectedUserContext } from "../context/SelectedUserContext";
import { useSelector } from "react-redux";

type userObj = {
  _id: string;
  username: string;
};

const ContactWindow = () => {
  const [seachTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const SelectUser = useContext(SelectedUserContext);

  const searchTermChangeHandler = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.currentTarget.value);
  };
  const onUserClick = (id: string, username: string) => {
    SelectUser.setSelectedUserId(id);
    SelectUser.setSelectedUserName(username);
  };

  useEffect(() => {
    let fetchData: number | undefined;
    if (seachTerm.length > 0) {
      fetchData = setTimeout(() => {
        axios
          .get(`/user/getSearchedUsers/${seachTerm}`, {
            params: {
              q: `${seachTerm}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            setSearchResults(response.data);
          });
      }, 500);
    }

    return () => {
      clearTimeout(fetchData);
    };
  }, [seachTerm]);

  return (
    <>
      <div className="flex h-full flex-col justify-evenly">
        <div className="flex p-2 gap-2 items-center">
          <input
            className="flex-grow p-1 text-slate-950"
            placeholder="search friends, users"
            type="text"
            onChange={searchTermChangeHandler}
          ></input>
          <span>
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </span>
        </div>
        <div className="flex-grow">
          {searchResults.length > 0 && seachTerm ? (
            <div className="bg-slate-700 m-2">
              {searchResults.map((result: userObj) => {
                return (
                  <UserDisplayDiv
                    onClick={() => {
                      onUserClick(result._id, result.username);
                    }}
                    className="border border-gray-500 cursor-pointer p-2"
                    key={result._id}
                    userID={result._id}
                  >
                    {result.username}
                  </UserDisplayDiv>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
export default ContactWindow;
