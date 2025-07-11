export interface CommentNotification {
  id: number;
  type: "comment";
  nickname: string;
  postTitle: string;
  postId: number;
  isReply: boolean;
  subText: string;
}

export interface AdNotification {
  id: number;
  type: "ad";
  postTitle: string;
  postId: number;
  reportCount: number;
}

export type NotificationType = CommentNotification | AdNotification;
