import { createContext, ReactNode, useContext, useState } from "react";

type UserContextValue = {
  user: User | null;
  signUser: (user: User) => void;
  deleteUser: (user: User) => void;
  updateUserDisplayPicture: (pictureUrl: string) => void;
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

  const updateUserDisplayPicture = (pictureUrl: String) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, displayPicture: pictureUrl };
    });
  };

  return (
    <UserContext.Provider
      value={{ user, signUser, deleteUser, updateUserDisplayPicture }}
    >
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
