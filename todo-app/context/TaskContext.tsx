import { createContext, ReactNode, useContext, useState } from "react";

type TaskContextValue = {
  tasks: Task[];
  addTask: (newTask: Task) => void;
  updateTask: (taskId: String, attribute: Partial<Task>) => void;
  setTaskList: (taskList: Task[]) => void;
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (taskId: String, attribute: Partial<Task>) => {
    setTasks((prevTask) =>
      prevTask.map((task) =>
        task.id === taskId ? { ...task, ...attribute } : task
      )
    );
  };

  const setTaskList = (taskList: Task[]) => {
    setTasks(taskList);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, setTaskList }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextValue => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within the TaskProvider");
  }
  return context;
};
