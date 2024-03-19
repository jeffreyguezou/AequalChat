import { ReactNode, createContext } from "react";
import { useState } from "react";

export const SelectedUserContext = createContext(
  {} as SelectedUserProviderType
);

type SelectedUserProps = {
  children: ReactNode;
};

type SelectedUserProviderType = {
  setSelectedUserId: React.Dispatch<React.SetStateAction<string>>;
  setSelectedUserName: React.Dispatch<React.SetStateAction<string>>;
  selectedUserName: string;
  selectedUserId: string;
  selectedUserBio: string;
  selectedUserProfile: string;
  setSelectedUserProfile: React.Dispatch<React.SetStateAction<string>>;
  setSelectedUserBio: React.Dispatch<React.SetStateAction<string>>;
  resetSelectedUser: () => void;
};

export function SelectedUserContextProvider({ children }: SelectedUserProps) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserBio, setSelectedUserBio] = useState("");
  const [selectedUserProfile, setSelectedUserProfile] = useState("");

  const resetSelectedUser = () => {
    setSelectedUserId("");
    setSelectedUserName("");
    setSelectedUserBio("");
    setSelectedUserProfile("");
  };

  let provider: SelectedUserProviderType = {
    selectedUserId,
    setSelectedUserId,
    selectedUserName,
    setSelectedUserName,
    selectedUserProfile,
    setSelectedUserProfile,
    selectedUserBio,
    setSelectedUserBio,
    resetSelectedUser,
  };

  return (
    <SelectedUserContext.Provider value={provider}>
      {children}
    </SelectedUserContext.Provider>
  );
}
