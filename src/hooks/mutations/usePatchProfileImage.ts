import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "../../apis/axiosInstance";

export const usePatchProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await axiosInstance.patch(
        "/api/member/profile-image",
        formData,
        {
          headers: {
            // Content-Type 지정 X (브라우저가 자동으로 multipart/form-data + boundary 설정함)
          }
        }
      );

      return res.data.result.profileImageUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    }
  });
};
