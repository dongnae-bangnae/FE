import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../../apis/axiosInstance";

interface LikePlace {
  regionId: number;
  name: string;
}

interface MyInfo {
  memberId: number;
  nickname: string;
  profileImage: string;
  likePlaces: LikePlace[];
  createdAt: string;
  updatedAt: string;
}

export const useMyInfo = () => {
  return useQuery<MyInfo>({
    queryKey: ["myInfo"],
    queryFn: async () => {
      const res = await axiosInstance.get("/member/info");
      const result = res.data?.result;

      if (!result) {
        throw new Error("유저 정보가 없습니다.");
      }

      return result;
    }
  });
};
