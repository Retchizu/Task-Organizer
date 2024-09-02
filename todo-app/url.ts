const baseUrl = "http://192.168.1.2:3000";

//user url
const registerUrl = `${baseUrl}/users/register`;
const logInUrl = `${baseUrl}/users/login`;
const logOutUrl = `${baseUrl}/users/logout`;
const refreshTokenUrl = `${baseUrl}/users/refresh-token`;
const updateDisplayPictureUrl = `${baseUrl}/users/add-display-picture`;

//task url
const getTaskUrl = `${baseUrl}/task/get-task`;
const currentUserUrl = `${baseUrl}/users/current`;
const addTaskUrl = `${baseUrl}/task/create-task`;
const updateTaskUrl = `${baseUrl}/task/update-task`;
const deleteTaskUrl = `${baseUrl}/task/delete-task`;

//notification url
const storeNotificationUrl = `${baseUrl}/notification/store-notification`;
const getNotificationUrl = `${baseUrl}/notification/get-notification`;
const deleteNotificationUrl = `${baseUrl}/notification/delete-notification`;
const updateNotificationUrl = `${baseUrl}/notification/update-status`;

export {
  baseUrl,
  registerUrl,
  logInUrl,
  refreshTokenUrl,
  updateDisplayPictureUrl,
  getTaskUrl,
  currentUserUrl,
  addTaskUrl,
  updateTaskUrl,
  deleteTaskUrl,
  logOutUrl,
  storeNotificationUrl,
  getNotificationUrl,
  deleteNotificationUrl,
  updateNotificationUrl,
};
