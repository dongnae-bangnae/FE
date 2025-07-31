import { axiosInstance } from "./axiosInstance";

// 홈 화면 새 글 리스트 조회 API (page=1 기본값)
export const getHomeArticles = async (page: number = 1) => {
  const response = await axiosInstance.get("/home/articles", {
    params: { page }
  });

  return response.data.result.postList;
};

// 챌린지 상세 정보 조회 API
export const getChallengeDetail = async (challengeId: string) => {
  const response = await axiosInstance.get(`/home/challenges/${challengeId}`);

  return response.data.result;
};
