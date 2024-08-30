import { createContext, ReactNode, useContext, useState } from "react";

type ModalContextValue = {
  isAddVisible: boolean;
  toggleAddVisible: () => void;
  isUpdateVisible: boolean;
  toggleUpdateVisible: () => void;
};

const AddTaskModal = createContext<ModalContextValue | undefined>(undefined);

export const AddTaskModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAddVisible, setIsAddvisible] = useState(false);
  const [isUpdateVisible, setIsUpdateVIsible] = useState(false);

  const toggleAddVisible = () => {
    setIsAddvisible(!isAddVisible);
  };

  const toggleUpdateVisible = () => {
    setIsUpdateVIsible(!isUpdateVisible);
  };

  return (
    <AddTaskModal.Provider
      value={{
        isAddVisible,
        toggleAddVisible,
        isUpdateVisible,
        toggleUpdateVisible,
      }}
    >
      {children}
    </AddTaskModal.Provider>
  );
};

export const useAddTaskModalContext = (): ModalContextValue => {
  const context = useContext(AddTaskModal);
  if (!context) {
    throw new Error(
      "useAddTaskModalContext must be used within the AddTaskModalProvider"
    );
  }
  return context;
};
