import { useSearchParams } from "react-router";

import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "@/heroes/components/SearchControls";
import { useSearchHero } from "@/heroes/hooks/useSearchHero";
import { HeroGrid } from "@/heroes/components/HeroGrid";

export const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const name = searchParams.get("name") ?? undefined;
  const team = searchParams.get("team") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const universe = searchParams.get("universe") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const strength = searchParams.get("strength") ?? undefined;

  const { data: hero = [] } = useSearchHero(
    name,
    team,
    category,
    universe,
    status,
    strength,
  );

  return (
    <>
      <CustomJumbotron title="Búsqueda de superhéroes" />
      {/* Breadcrumbs */}
      <CustomBreadcrumbs
        currentPage="Búsqueda"
        // breadcrumbs={[
        //   { label: "Home", to: "/" },
        //   { label: "Home2", to: "/" },
        //   { label: "Home3", to: "/" },
        // ]}
      />
      {/* Stats Dashboard */}
      <HeroStats />
      {/* Filter and search */}
      <SearchControls />
      {/* Hero Grid */}
      <HeroGrid heroes={hero} />
    </>
  );
};

export default SearchPage;
