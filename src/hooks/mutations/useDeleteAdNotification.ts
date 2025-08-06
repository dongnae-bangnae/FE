import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAdNotification } from "../../apis/notification";

export const useDeleteAdNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      deleteAdNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adNotifications"] });
    }
  });
};
