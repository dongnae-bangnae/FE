export interface CommentNotification {
  // id: number;
  // type: "comment";
  // nickname: string;
  // postTitle: string;
  // postId: number;
  // isReply: boolean;
  // subText: string;
  id: number; // 알림 ID → notificationId
  type: "comment";
  articleId: number;
  articleTitle: string;
  commentId: number;
  commentContent: string;
  commenterNickname: string;
}

export interface AdNotification {
  // id: number;
  // type: "ad";
  // postTitle: string;
  // postId: number;
  // reportCount: number;
  notificationId: number; // 알림 ID
  type: "ad";
  articleId: number; // 게시글 ID
  articleTitle: string; // 게시글 제목
  spamCount: number; // 광고 의심 신고 수
}

export type NotificationType = CommentNotification | AdNotification;
