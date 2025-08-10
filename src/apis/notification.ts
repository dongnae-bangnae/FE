import { axiosInstance } from "../apis/axiosInstance";
import { AdNotification } from "../types/notification";

// 광고 의심 알림 목록 조회
export const fetchAdNotification = async (cursor = 0, limit = 10) => {
  const { data } = await axiosInstance.get<{
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
      notifications: AdNotification[];
      cursor: number;
      limit: number;
      hasNext: boolean;
    };
  }>(`/api/notifications/spams?cursor=${cursor}&limit=${limit}`);
  return data.result;
};

// 특정 광고 의심 알림 삭제
export const deleteAdNotification = async (notificationId: number) => {
  const { data } = await axiosInstance.delete(
    `/api/notifications/spams/${notificationId}`
  );
  return data;
};
