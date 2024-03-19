import UserDisplayDiv from "../elements/userDisplayDiv";
import { useSelector } from "react-redux";
import { IRootState } from "../store/store";

type ChatHistoryprop = {
  friends;
};

const ChatHistory = ({ friends }: ChatHistoryprop) => {
  const msgs = useSelector((state: IRootState) => state.messages);

  if (friends) {
    return (
      <div className="flex-grow">
        {friends.map((friend: string) => {
          let msgRecieved = msgs[friend];
          return (
            <UserDisplayDiv
              key={friend}
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
