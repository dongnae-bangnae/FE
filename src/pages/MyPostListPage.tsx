import { useLocation, useParams } from "react-router-dom";

import Header from "../components/common/Header";
import MyPagePostCard from "../components/MyPagePostCard";
import SkeletonPostCard from "../components/SkeletonPostCard";
import { useArticles } from "../hooks/queries/useArticles"; // 전체 목록 훅 (cursor/limit)

function MyPostListPage() {
  // :regionId 또는 :placeId 둘 다 대응
  const { regionId: regionIdParam, placeId: placeIdParam } = useParams<{
    regionId?: string;
    placeId?: string;
  }>();

  // 최종 regionId
  const regionId = Number(regionIdParam ?? placeIdParam);

  const location = useLocation();
  const state = location.state as { title?: string } | undefined;

  const { data, isLoading } = useArticles(0, 20); // 필요 시 limit 조절
  const all = data?.articles ?? [];

  // “특정 지역 + 내가 쓴 글만”
  const articles = all.filter(
    (a) => a.isMine === true && a.regionId === regionId
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title={state?.title ?? "내 게시물"} underline={false} />

      <div className="flex-1 px-4 py-4 flex flex-col gap-4 items-center">
        {isLoading && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonPostCard key={i} />
            ))}
          </>
        )}

        {!isLoading && articles.length === 0 && (
          <div>이 지역에 내가 작성한 게시글이 없습니다.</div>
        )}

        {!isLoading &&
          articles.map((a) => (
            <MyPagePostCard
              key={a.articleId}
              articleId={a.articleId} // 게시글 ID
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
      </div>
    </div>
  );
}

export default MyPostListPage;
