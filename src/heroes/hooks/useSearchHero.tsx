import { useQuery } from "@tanstack/react-query";

import { searchHeroAction } from "../actions/search-hero.action";

export const useSearchHero = (
  name?: string,
  team?: string,
  category?: string,
  universe?: string,
  status?: string,
  strength?: string,
) => {
  return useQuery({
    queryKey: [
      "searched-hero",
      { name, team, category, universe, status, strength },
    ],
    queryFn: () =>
      searchHeroAction({ name, team, category, universe, status, strength }),
    staleTime: 1000 * 60 * 5,
  });
};
