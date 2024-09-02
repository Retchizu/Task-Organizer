import axios from "axios";
import { storeNotificationUrl } from "../../url";

export const storeNotificationApi = async (
  userId: string,
  taskId: string,
  notificationMessage: string,
  isRead: boolean,
  accessToken: string
) => {
  return await axios.post(
    storeNotificationUrl,
    {
      userId: userId,
      taskId: taskId,
      notificationMessage: notificationMessage,
      isRead: isRead,
    },
    {
      headers: {
        Authorization: `${accessToken}`,
      },
    }
  );
};
