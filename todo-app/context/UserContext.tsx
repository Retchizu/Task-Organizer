import { createContext, ReactNode, useContext, useState } from "react";

type UserContextValue = {
  user: User | null;
  signUser: (user: User) => void;
  deleteUser: (user: User) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const signUser = (user: User) => {
    setUser(user);
  };

  const deleteUser = (user: User) => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, signUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within the UserContext");
  }
  return context;
};
