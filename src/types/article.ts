export interface CreatedArticleResult { 
  articleId: number;
  memberId: number;
  categoryId: number;
  placeId: number;
  placeName: string;
  pinCategory: string;
  detailAddress: string;
  title: string; 
  date: string;      
  content: string;
  mainImageUuid: string;
  imageUuids: string[];
  likeCount: number;
  spamCount: number;
  createdAt: string;
  updatedAt: string;
}

// 작성용 타입
export interface ArticleForm {
  articleId?: number;
  memberId?: number;
  categoryId: number;
  // placeId: number;
  title: string;
  date: string;
  content: string;
  mainImageUuid?: string;
  imageUuids?: string[];
  latitude?: number;
  longitude?: number;
  placeName: string;
  pinCategory: string;
  detailAddress: string;
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

// 게시글 리스트 조회 타입
export interface ArticleListItem {
  memberId: number;
  articleId: number;
  placeId: number;
  nickname: string;
  title: string;
  pinCategory: string;
  mainImageUuid: string; // 썸네일
  likeCount: number;
  spamCount: number;
  commentCount: number;
  isLiked: boolean;
  isSpammed: boolean;
  isMine: boolean;
  createdAt: string;
  updatedAt: string;
  // userImage(프로필) 필드가 응답에 없으면 백엔드 추가 전까진 null 처리
  userImage?: string | null;
}
