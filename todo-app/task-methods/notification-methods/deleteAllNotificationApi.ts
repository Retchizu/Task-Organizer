import axios from "axios";
import { deleteNotificationUrl } from "../../url";

export const deleteAllNotificationApi = async (accessToken: string) => {
  return await axios.delete(deleteNotificationUrl, {
    headers: {
      Authorization: `${accessToken}`,
    },
  });
};
