import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "../../apis/axiosInstance";

const deleteCommentNotification = async (notificationId: number) => {
  await axiosInstance.delete(`/api/notifications/comments/${notificationId}`);
};

export const useDeleteCommentNotification = () => {
  return useMutation({
    mutationFn: deleteCommentNotification
  });
};
