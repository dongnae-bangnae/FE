import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Header from "../components/common/Header";
import PostCard from "../components/Home/PostCard";
import { useCategoryArticles } from "../hooks/queries/useCategoryArticles";

function LocationPostsPage() {
  const { placeId } = useParams<{ placeId: string }>();
  const location = useLocation();
  const state = location.state as { categoryName?: string };
  const categoryId = Number(placeId);

  const { data, isLoading } = useCategoryArticles(categoryId);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title={state?.categoryName ?? placeId} underline={true} />

      <div className="flex-1 px-4 py-6 flex flex-col gap-4 items-center">
        {isLoading && <div>로딩 중...</div>}

        {data?.articles?.length === 0 && <div>게시글이 없습니다.</div>}

        {data?.articles?.map((article) => (
          <PostCard
            key={article.articleId}
            profileImage={article.profileImage}
            nickname={article.nickname}
            category={article.pinCategory}
            image={article.imageUrl}
            content={article.title}
            likes={article.likes}
            comments={article.comments}
            views={article.views}
          />
        ))}
      </div>
    </div>
  );
}

export default LocationPostsPage;
