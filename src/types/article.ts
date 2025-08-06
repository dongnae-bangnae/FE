// 작성용 타입
export interface ArticleForm {
  articleId?: number;
  memberId?: number;
  categoryId: number;
  // placeId: number;
  regionId: number;
  title: string;
  date: string;
  content: string;
  mainImageUuid: string;
  latitude: number;
  longitude: number;
  placeName: string;
  pinCategory: string;
  detailAddress: string;
  imageUuids: string[];
}

// 상세 페이지
export interface ArticleDetail extends ArticleForm {
  likeCount: number;
  spamCount: number;
  updatedAt: string;
  createdAt: string;
}

// 좋아요 등록, 취소
export interface LikeResponse {
  likeCount: number;
}

// 홈 새 글 리스트용 타입
export interface ArticlePreview {
  id: number;
  title: string;
  createdAt: string;
  authorNickname: string;
  profileImageUrl?: string;
  imageUrl?: string;
}
