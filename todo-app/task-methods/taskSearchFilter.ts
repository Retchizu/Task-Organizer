export const taskSearchFilterOnGoing = (text: string, list: Task[]): Task[] => {
  return list.filter(
    (task) =>
      task.taskLabel.toLowerCase().includes(text.toLowerCase()) &&
      task.taskStatus === "ongoing"
  );
};

export const taskSearchFilterFinished = (
  text: string,
  list: Task[]
): Task[] => {
  return list.filter(
    (task) =>
      task.taskLabel.toLowerCase().includes(text.toLowerCase()) &&
      task.taskStatus === "finished"
  );
};
