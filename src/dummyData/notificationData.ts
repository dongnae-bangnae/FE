import { NotificationType } from "../types/notification";

export const commentNotifications: NotificationType[] = [
  {
    id: 1,
    type: "comment",
    nickname: "코코볼",
    postTitle: "연남동에서의 데이트",
    postId: 101,
    isReply: false,
    subText: "여기 좋아보이시면 00샤도 추천해요!"
  },
  {
    id: 2,
    type: "comment",
    nickname: "유엠씨",
    postTitle: "연남동 산책길",
    postId: 102,
    isReply: false,
    subText: "저도 가보고 싶어요"
  },
  {
    id: 3,
    type: "comment",
    nickname: "04냥이",
    postTitle: "망원동 복카페",
    postId: 103,
    isReply: false,
    subText:
      "다양한 고양이 체험이 있어요. 조용한 분위기입니다. 사장님도 매우 친절하세요 ㅎㅎ"
  }
];

export const adNotifications: NotificationType[] = [
  {
    id: 1,
    type: "ad",
    postTitle: "망원동 산책길",
    postId: 101,
    reportCount: 10
  },
  {
    id: 2,
    type: "ad",
    postTitle: "연남동 떡볶이",
    postId: 102,
    reportCount: 17
  },
  {
    id: 3,
    type: "ad",
    postTitle: "망원동 산책길",
    postId: 101,
    reportCount: 20
  }
];
