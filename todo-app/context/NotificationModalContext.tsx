import { createContext, ReactNode, useContext, useState } from "react";
import NotificationModal from "../components/NotificationModal";

type NotificationModalContextValue = {
  isNotificationModalVisible: boolean;
  toggleNotificationModalVisibility: () => void;
};

const NotificationModalContext = createContext<
  NotificationModalContextValue | undefined
>(undefined);

export const NotificationModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isNotificationModalVisible, setIsNotificationModalVisible] =
    useState(false);

  const toggleNotificationModalVisibility = () => {
    setIsNotificationModalVisible(!isNotificationModalVisible);
  };

  return (
    <NotificationModalContext.Provider
      value={{ isNotificationModalVisible, toggleNotificationModalVisibility }}
    >
      {children}
    </NotificationModalContext.Provider>
  );
};

export const useNotificationModalContext =
  (): NotificationModalContextValue => {
    const context = useContext(NotificationModalContext);
    if (!context) {
      throw new Error(
        "NotificationModalContext must be used within the NotificationModalProvider"
      );
    }
    return context;
  };
