import { axiosInstance } from "./axiosInstance";

/** 스웨거 예시 스키마 기반 */
export type HomeArticle = {
  articleId: number;
  memberId: number;
  categoryId: number;
  placeId: number;
  regionId: number;
  username: string;
  title: string;
  content: string;
  likeCount: number;
  spamCount: number;
  createdAt: string;

  // 혹시 BE가 주면 쓰기 위한 확장 필드(옵셔널)
  mainImageUuid?: string;
  imageUrl?: string;
  profileImageUrl?: string;
  nickname?: string;
  authorNickname?: string;
};

export type HomeArticlesResult = {
  postList: HomeArticle[];
  listSize: number;
  totalPage: number;
  totalElements: number;
  isFirst: boolean;
  isLast: boolean;
};

/** 홈 화면 새 글 리스트 조회 (page는 1부터) */
export const getNewArticles = async (
  page: number = 1
): Promise<HomeArticlesResult> => {
  const { data } = await axiosInstance.get("/api/home/articles", {
    params: { page }
  });
  // 서버가 {result:{...}} 형태로 줄 수도 있어 안전하게 처리
  return (data?.result ?? data) as HomeArticlesResult;
};

/** 챌린지 상세 */
export const getChallengeDetail = async (challengeId: string) => {
  const { data } = await axiosInstance.get(
    `/api/home/challenges/${challengeId}`
  );
  return data.result;
};
