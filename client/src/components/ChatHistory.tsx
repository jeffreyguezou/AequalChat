import UserDisplayDiv from "../elements/userDisplayDiv";
import { useSelector } from "react-redux";

type ChatHistoryprop = {
  friends;
};

const ChatHistory = ({ friends }: ChatHistoryprop) => {
  const msgs = useSelector((state) => state.messages);

  if (friends) {
    return (
      <div className="flex-grow">
        {friends.map((friend: string) => {
          let msgRecieved = msgs[friend];
          return (
            <UserDisplayDiv
              userID={friend}
              type="friend"
              onClick={() => {
                console.log("clicked");
              }}
              msgRecieved={msgRecieved}
            />
          );
        })}
      </div>
    );
  }
};
export default ChatHistory;
