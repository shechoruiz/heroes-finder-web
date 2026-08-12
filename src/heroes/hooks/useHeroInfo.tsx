import { useQuery } from "@tanstack/react-query";
import { getHeroAction } from "../actions/get-hero.action";

export const useHeroInfo = (idSlug: string) => {
  return useQuery({
    queryKey: ["hero-info", idSlug],
    queryFn: () => getHeroAction(idSlug),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
