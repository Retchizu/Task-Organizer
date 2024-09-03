import axios from "axios";
import { updateNotificationUrl } from "../../url";

export const updateNotificationStatusApi = async (
  notificationId: String,
  status: boolean,
  accessToken: string
) => {
  return await axios.put(
    `${updateNotificationUrl}/${notificationId}`,
    {
      isRead: status,
    },
    {
      headers: {
        Authorization: `${accessToken}`,
      },
    }
  );
};
