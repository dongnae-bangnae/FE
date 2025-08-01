import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "../../apis/axiosInstance";

const deleteCommentNotification = async (notificationId: number) => {
  await axiosInstance.delete(
    `/api/member/comments/notifications/${notificationId}`
  );
};

export const useDeleteCommentNotification = () => {
  return useMutation({
    mutationFn: deleteCommentNotification
  });
};
