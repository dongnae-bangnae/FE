import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import PostCard from "../components/Home/PostCard";
import {
  usePlaceArticlesV2,
  type PlaceArticlesPageV2
} from "../hooks/queries/useArticles";
import { imageUrlFromUuid } from "../utils/image";
import type { PlaceArticleRow } from "../apis/article";

function useQueryNumber(key: string, fallback = 0) {
  const { search } = useLocation();
  return useMemo(() => {
    const v = new URLSearchParams(search).get(key);
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }, [search, key, fallback]);
}

function RecordListPage() {
  const navigate = useNavigate();
  const placeId = useQueryNumber("placeId", 0);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usePlaceArticlesV2(placeId, 10); //  V2 훅 사용

  const items = useMemo<PlaceArticleRow[]>(
    () => (data ? data.pages.flatMap((p: PlaceArticlesPageV2) => p.items) : []),
    [data]
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="게시물 확인" />

      {!placeId && (
        <div className="px-4 py-6 text-center text-sm text-gray-500">
          placeId가 없습니다. /record/list?placeId=123 형태로 접근하세요.
        </div>
      )}
      {isLoading && (
        <div className="px-4 py-6 text-center text-sm text-gray-500">
          불러오는 중…
        </div>
      )}
      {isError && (
        <div className="px-4 py-6 text-center text-red-500">
          목록을 불러오지 못했습니다.
        </div>
      )}

      <div className="py-6 space-y-[30px] flex flex-col items-center">
        {items.map((row: PlaceArticleRow) => (
          <div
            key={row.articleId}
            onClick={() => navigate(`/record/${row.articleId}`)}
            className="cursor-pointer"
          >
            <PostCard
              profileImage={"https://via.placeholder.com/30"}
              nickname={row.nickname}
              category={row.pinCategory}
              image={imageUrlFromUuid(row.mainImageUuid)}
              content={row.title}
              likes={row.likeCount}
              comments={row.commentCount}
              views={0}
            />
          </div>
        ))}

        {hasNextPage && (
          <button
            className="mt-2 mb-10 px-4 py-2 rounded-md border border-gray-200 text-sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "불러오는 중…" : "더 보기"}
          </button>
        )}

        {!isLoading && !isError && items.length === 0 && placeId !== 0 && (
          <div className="px-4 py-10 text-center text-sm text-gray-400">
            아직 게시물이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default RecordListPage;
