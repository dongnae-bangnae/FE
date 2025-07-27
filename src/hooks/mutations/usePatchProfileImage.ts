import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "../../apis/axiosInstance";

export const usePatchProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file); // key 이름은 백엔드에 따라 다를 수 있음

      const res = await axiosInstance.patch(
        "/api/member/profile-image",
        formData,
        {
          headers: {
            // Content-Type 지정하지 않기 (브라우저가 자동으로 multipart/form-data + boundary 설정함)
          }
        }
      );

      return res.data.result.profileImageUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myInfo"]);
    }
  });
};
