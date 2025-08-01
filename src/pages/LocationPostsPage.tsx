import { useLocation, useParams } from "react-router-dom";

import Header from "../components/common/Header";
import MyPagePostCard from "../components/MyPagePostCard";
import SkeletonPostCard from "../components/SkeletonPostCard";
import { useCategoryArticles } from "../hooks/queries/useCategoryArticles";

function LocationPostsPage() {
  const { placeId } = useParams<{ placeId: string }>();
  const location = useLocation();
  const state = location.state as { categoryName?: string };
  const categoryId = Number(placeId);

  const { data, isLoading } = useCategoryArticles(categoryId);

  const articles = data?.articles ?? [];

  console.log("categoryId:", placeId);
  console.log("data:", data);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title={state?.categoryName ?? placeId} underline={false} />

      <div className="flex-1 px-4 py-4 flex flex-col gap-4 items-center">
        {isLoading && <div>로딩 중...</div>}
        {articles.length === 0 && !isLoading && <div>게시글이 없습니다.</div>}

        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <SkeletonPostCard key={i} />
            ))
          : articles.map((article) => (
              <MyPagePostCard
                key={article.articleId}
                category={article.pinCategory}
                imageUrl={article.imageUrl}
                title={article.title}
                likes={article.likes}
                comments={article.comments}
                spam={article.spam}
              />
            ))}
      </div>
    </div>
  );
}

export default LocationPostsPage;
