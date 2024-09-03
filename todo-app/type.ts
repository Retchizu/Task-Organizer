type Task = {
  id: String;
  userId: String;
  taskLabel: String;
  taskDescription: String;
  taskStatus: String;
  taskDeadline: Date;
};

type User = {
  id: String;
  email: String;
  userName: String;
  displayPicture: String;
};

type TaskNotification = {
  _id: String;
  userId: String;
  isRead: boolean;
  notificationMessage: String;
  task: Task;
};
