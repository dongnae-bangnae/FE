import { useQuery } from "@tanstack/react-query";
import { getChallengeDetail } from "../../apis/home";

export const useChallengeDetail = (challengeId: string, enabled = true) => {
  return useQuery({
    queryKey: ["challengeDetail", challengeId],
    queryFn: () => getChallengeDetail(challengeId),
    enabled
  });
};
