import { ReactNode, createContext, useState } from "react";

export const LeftDisplayContext = createContext<LeftDisplayContextType>(
  {} as LeftDisplayContextType
);

type LeftDisplayContextType = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

type LeftDC = {
  children: ReactNode;
};
export function LeftDisplayContextProvider({ children }: LeftDC) {
  const [activeTab, setActiveTab] = useState("chats");

  let providerVal: LeftDisplayContextType = {
    activeTab,
    setActiveTab,
  };
  return (
    <LeftDisplayContext.Provider value={providerVal}>
      {children}
    </LeftDisplayContext.Provider>
  );
}
