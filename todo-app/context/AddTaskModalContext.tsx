import { createContext, ReactNode, useContext, useState } from "react";

type ModalContextValue = {
  isOpen: boolean;
  toggleModal: () => void;
  isUpdate: boolean;
  toggleUpdate: () => void;
};

const AddTaskModal = createContext<ModalContextValue | undefined>(undefined);

export const AddTaskModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const toggleUpdate = () => {
    setIsUpdate(!isUpdate);
  };

  return (
    <AddTaskModal.Provider
      value={{ isOpen, toggleModal, isUpdate, toggleUpdate }}
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
