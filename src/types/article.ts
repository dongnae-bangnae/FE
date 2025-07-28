// 작성용 타입
export interface ArticleForm {
  articleId?: number;         
  memberId?: number;          
  categoryId: number;
  placeId: number;
  regionId: number
  title: string;
  date: string;              
  content: string;
  mainImageUuid: string;
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
