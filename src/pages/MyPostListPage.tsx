import { useLocation, useParams } from "react-router-dom";

import Header from "../components/common/Header";
import MyPagePostCard from "../components/MyPagePostCard";
import SkeletonPostCard from "../components/SkeletonPostCard";
import { usePlaceArticles } from "../hooks/queries/useArticles";

type RouteParams = { placeId?: string };

export default function MyPostListPage() {
  const { placeId: placeIdParam } = useParams<RouteParams>();
  const placeId = Number(placeIdParam);
  const location = useLocation();
  const state = location.state as { title?: string } | undefined;

  // placeId 유효성 가드
  if (!Number.isFinite(placeId)) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header title="내 게시물" underline={false} />
        <div className="p-4">유효하지 않은 장소입니다.</div>
      </div>
    );
  }

  // 스웨거 규칙: 첫 페이지는 cursor=-1로 시작 (훅 내부에서 처리됨)
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePlaceArticles(placeId, 20);

  // pages → items 평탄화
  const all = data?.pages.flatMap((p) => p.items) ?? [];
  // 내 글만 필터
  const myArticles = all.filter((a) => a.isMine === true);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title={state?.title ?? "내 게시물"} underline={false} />

      <div className="flex-1 px-4 py-4 flex flex-col gap-4 items-center">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => <SkeletonPostCard key={i} />)}

        {!isLoading && myArticles.length === 0 && (
          <div>이 장소에 내가 작성한 게시글이 없습니다.</div>
        )}

        {!isLoading &&
          myArticles.map((a) => (
            <MyPagePostCard
              key={a.articleId}
              articleId={a.articleId}
              category={a.pinCategory}
              imageUrl={a.mainImageUuid}
              title={a.title}
              likes={a.likeCount}
              comments={a.commentCount}
              spam={a.spamCount}
              nickname={a.nickname}
              userImage={a.userImage ?? null}
            />
          ))}

        {hasNextPage && (
          <button
            className="mt-4 px-4 py-2 rounded-lg border"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
          </button>
        )}
      </div>
    </div>
  );
}
