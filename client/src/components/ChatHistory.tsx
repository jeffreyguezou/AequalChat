import UserDisplayDiv from "../elements/userDisplayDiv";

type ChatHistoryprop = {
  friends: [];
};

const ChatHistory = ({ friends }: ChatHistoryprop) => {
  console.log(friends);
  if (friends) {
    return (
      <div className="flex-grow">
        {friends.map((friend: string) => {
          return (
            <UserDisplayDiv
              userID={friend}
              type="friend"
              onClick={() => {
                console.log("clicked");
              }}
            />
          );
        })}
      </div>
    );
  }
};
export default ChatHistory;
