import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../../apis/axiosInstance";

export const fetchCommentNotifications = async (
  cursor = 0,
  limit = 10
): Promise<any> => {
  const response = await axiosInstance.get(
    `/api/member/comments/notifications?cursor=${cursor}&limit=${limit}`
  );
  return response.data.result;
};

export const useCommentNotifications = (cursor = 0, limit = 10) => {
  return useQuery({
    queryKey: ["commentNotifications", cursor],
    queryFn: () => fetchCommentNotifications(cursor, limit)
  });
};
