import { useMutation } from "@tanstack/react-query";
import { ArticleForm } from "../../types/article";
import { axiosInstance } from "../../apis/axiosInstance";

export const useCreateArticle = () => {
  return useMutation<number, Error, ArticleForm>({
    mutationFn: async (articleData: ArticleForm) => {

      const formData = new FormData();

      console.log("mainImageUuid:", articleData.mainImageUuid);
      console.log("imageUuids:", articleData.imageUuids);

      const jsonBlob = new Blob([JSON.stringify(articleData)], {
        type: "application/json",
      });

      formData.append("request", jsonBlob);

      const response = await axiosInstance.post("/api/articles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.result.articleId;
    },
  });
};
