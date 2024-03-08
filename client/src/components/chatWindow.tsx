type ChatWindowProps = {
  selecteduserId: string;
  selectedUserName: string;
};

const ChatWindow = ({ selecteduserId, selectedUserName }: ChatWindowProps) => {
  return (
    <>
      {selecteduserId && (
        <>
          <div className="flex-grow">
            <div className="p-2 bg-slate-700 text-gray-200">
              <h1>{selectedUserName}</h1>
            </div>
          </div>
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
        </>
      )}
      {!selecteduserId && <div>Select a user to start chaetting</div>}
    </>
  );
};
export default ChatWindow;
