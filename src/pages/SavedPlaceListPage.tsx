import { useLocation, useParams } from "react-router-dom";

import Header from "../components/common/Header";
import MyPagePostCard from "../components/MyPagePostCard";
import SkeletonPostCard from "../components/SkeletonPostCard";
import { usePlaceArticles } from "../hooks/queries/useArticles";

function SavedPlaceListPage() {
  const { placeId } = useParams<{ placeId: string }>();
  const placeIdNum = Number(placeId);

  const location = useLocation();
  const state = location.state as { placeName?: string } | undefined;

  if (!Number.isFinite(placeIdNum)) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header title="장소 게시물" underline={false} />
        <div className="p-4">유효하지 않은 장소입니다.</div>
      </div>
    );
  }

  // ✅ placeId 기반 무한스크롤 (첫 페이지 cursor 없음)
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePlaceArticles(placeIdNum, 20);

  // pages -> items 평탄화
  const articles = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title={state?.placeName ?? "장소 게시물"} underline={false} />

      <div className="flex-1 px-4 py-4 flex flex-col gap-4 items-center">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => <SkeletonPostCard key={i} />)}

        {!isLoading && articles.length === 0 && (
          <div>이 장소에 등록된 게시글이 없습니다.</div>
        )}

        {!isLoading &&
          articles.map((a) => (
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

export default SavedPlaceListPage;
