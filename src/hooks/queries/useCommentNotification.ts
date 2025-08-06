import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../../apis/axiosInstance";

export const fetchCommentNotification = async (
  cursor = 0,
  limit = 10
): Promise<any> => {
  const response = await axiosInstance.get(
    `/api/notifications/comments?cursor=${cursor}&limit=${limit}`
  );
  return response.data.result;
};

export const useCommentNotification = (cursor = 0, limit = 10) => {
  return useQuery({
    queryKey: ["commentNotifications", cursor],
    queryFn: () => fetchCommentNotification(cursor, limit)
  });
};
