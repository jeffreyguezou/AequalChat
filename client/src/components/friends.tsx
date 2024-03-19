import { useSelector } from "react-redux";
import UserDisplayDiv from "../elements/userDisplayDiv";
import { IRootState } from "../store/store";

const Friends = () => {
  const appData = useSelector((state: IRootState) => state.app);
  console.log(appData);

  const onUserClick = (id: string, username: string) => {
    console.log(id, username);
  };

  return (
    <div className="h-full">
      <div>
        <h1>New requests</h1>
        {!appData[0] && (
          <div>
            {appData[0].requests.length == 0 && <div>No requests yet</div>}
          </div>
        )}
        {appData[0] && (
          <div>
            {appData[0].requests.map((userID: string) => {
              return (
                <UserDisplayDiv
                  type="request"
                  key={userID}
                  userID={userID}
                ></UserDisplayDiv>
              );
            })}
          </div>
        )}
      </div>
      <div>
        <h1>Existing friends</h1>
        {!appData[0] && (
          <div>{!appData[0].friends && <div>No friends yet</div>}</div>
        )}
        {appData[0] && (
          <div>
            {appData[0].friends.map((userID: string) => {
              return (
                <UserDisplayDiv
                  onClick={(userID, username) => {
                    onUserClick(userID, username);
                  }}
                  type="friends"
                  key={userID}
                  userID={userID}
                ></UserDisplayDiv>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default Friends;
