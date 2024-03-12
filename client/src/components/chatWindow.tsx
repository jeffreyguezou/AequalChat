import { useState } from "react";
import { useSelector } from "react-redux";

type ChatWindowProps = {
  selecteduserId: string;
  selectedUserName: string;
  onSendReq: (recipient) => void;
};

const ChatWindow = ({
  selecteduserId,
  selectedUserName,
  onSendReq,
}: ChatWindowProps) => {
  const [isFriend, setIsFriend] = useState(false);

  const getIsFriend = () => {
    const user = useSelector((state) => state.user);
    let userFriends = user[0].friends;
    if (userFriends.includes(selecteduserId)) {
      setIsFriend(true);
    }
  };

  return (
    <>
      {selecteduserId && (
        <>
          <div className="flex-grow flex flex-col">
            <div className="p-2 bg-slate-700 text-gray-200">
              <h1>{selectedUserName}</h1>
            </div>
            {!isFriend && (
              <div className="flex flex-grow items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  onClick={() => onSendReq(selecteduserId)}
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
          </div>
          {isFriend && (
            <div className="flex m-4 gap-4 items-center">
              <input
                className="p-2 flex-grow"
                type="text"
                placeholder="type your message"
              ></input>
              <button className="text-center border border-gray-50 p-1 hover:bg-slate-400">
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
      {!selecteduserId && <div>Select a user to start chaetting</div>}
    </>
  );
};
export default ChatWindow;
