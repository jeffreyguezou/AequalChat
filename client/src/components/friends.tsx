import { useSelector } from "react-redux";
import UserDisplayDiv from "../elements/userDisplayDiv";

const Friends = () => {
  const appData = useSelector((state) => state.app);
  console.log(appData);

  return (
    <div className="h-full">
      {!appData[0] && <div>No requests yet</div>}

      {appData[0] && (
        <div>
          {appData[0].requests.map((userID: string) => {
            return (
              <UserDisplayDiv key={userID} userID={userID}></UserDisplayDiv>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Friends;
