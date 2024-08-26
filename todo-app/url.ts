const baseUrl = "http://192.168.1.2:3000";

const registerUrl = `${baseUrl}/users/register`;
const logInUrl = `${baseUrl}/users/login`;
const logOutUrl = `${baseUrl}/users/logout`;
const refreshTokenUrl = `${baseUrl}/users/refresh-token`;
const updateDisplayPictureUrl = `${baseUrl}/users/add-display-picture`;
const getTaskUrl = `${baseUrl}/task/get-task`;
const currentUserUrl = `${baseUrl}/users/current`;
const addTaskUrl = `${baseUrl}/task/create-task`;
const updateTaskUrl = `${baseUrl}/task/update-task`;
const deleteTaskUrl = `${baseUrl}/task/delete-task`;

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
};
