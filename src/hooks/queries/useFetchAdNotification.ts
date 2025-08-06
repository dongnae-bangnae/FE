import { useQuery } from "@tanstack/react-query";

import { fetchAdNotification } from "../../apis/notification";

export const useFetchAdNotification = (cursor = 0, limit = 10) => {
  return useQuery({
    queryKey: ["adNotifications", cursor, limit],
    queryFn: () => fetchAdNotification(cursor, limit)
  });
};
