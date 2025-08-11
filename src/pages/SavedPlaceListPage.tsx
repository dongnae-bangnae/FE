import { useLocation, useParams } from "react-router-dom";

import Header from "../components/common/Header";
import MyPagePostCard from "../components/MyPagePostCard";
import SkeletonPostCard from "../components/SkeletonPostCard";
import { useArticles } from "../hooks/queries/useArticles";

function SavedPlaceListPage() {
  const { placeId } = useParams<{ placeId: string }>();
  const placeIdNum = Number(placeId);

  const location = useLocation();
  const state = location.state as { placeName?: string } | undefined;

  // 같은 API 호출 (cursor/limit 필요 시 조절)
  const { data, isLoading } = useArticles(0, 20);
  const all = data?.articles ?? [];

  // 이 장소에 등록된 게시물만
  const articles = all.filter((a) => a.placeId === placeIdNum);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title={state?.placeName ?? "장소 게시물"} underline={false} />

      <div className="flex-1 px-4 py-4 flex flex-col gap-4 items-center">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonPostCard key={i} />)
        ) : articles.length === 0 ? (
          <div>이 장소에 등록된 게시글이 없습니다.</div>
        ) : (
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
          ))
        )}
      </div>
    </div>
  );
}

export default SavedPlaceListPage;
