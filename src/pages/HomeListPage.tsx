import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import Header from "../components/common/Header";
import PostCard from "../components/Home/PostCard";
import { imageUrlFromUuid } from "../utils/image";

import {
  getNewArticles,
  type HomeArticlesResult,
  type HomeArticle
} from "../apis/home";

function HomeListPage() {
  const navigate = useNavigate();

  // /api/home/articles  (page는 1부터 시작)
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<HomeArticlesResult>({
    queryKey: ["home", "articles"],
    queryFn: ({ pageParam = 1 }) => getNewArticles(pageParam as number),
    getNextPageParam: (lastPage, pages) =>
      lastPage.isLast ? undefined : pages.length + 1,
    initialPageParam: 1,
    staleTime: 60_000
  });

  const items = useMemo<HomeArticle[]>(
    () => (data ? data.pages.flatMap((p) => p.postList) : []),
    [data]
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="게시물 확인" />

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
        {items.map((row) => {
          const nickname =
            row.nickname ?? row.authorNickname ?? row.username ?? "익명";

          const image =
            (row.mainImageUuid && imageUrlFromUuid(row.mainImageUuid)) ||
            row.imageUrl ||
            undefined;

          return (
            <div
              key={row.articleId}
              onClick={() => {
                // 상세 첫 진입 시 1회 강제 리로드
                sessionStorage.setItem("rdp_force_reload", "1");
                navigate(`/record/${row.articleId}`);
              }}
              className="cursor-pointer"
            >
              <PostCard
                profileImage={
                  row.profileImageUrl || "https://via.placeholder.com/30"
                }
                nickname={nickname}
                // 기존 PostCard prop 유지: 문자열 카테고리
                category={String(row.categoryId)}
                image={image}
                content={row.title}
                likes={row.likeCount}
                // 스펙에 없으니 0으로 표시
                comments={0}
                views={0}
              />
            </div>
          );
        })}

        {hasNextPage && (
          <button
            className="mt-2 mb-10 px-4 py-2 rounded-md border border-gray-200 text-sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "불러오는 중…" : "더 보기"}
          </button>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-gray-400">
            아직 게시물이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeListPage;
