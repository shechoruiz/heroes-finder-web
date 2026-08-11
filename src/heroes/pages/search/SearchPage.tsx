import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "@/heroes/components/SearchControls";

export const SearchPage = () => {
  return (
    <>
      <CustomJumbotron title="Busqueda de superheroes" />
      {/* Breadcrumbs */}
      <CustomBreadcrumbs
        currentPage="Busqueda"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Home2", to: "/" },
          { label: "Home3", to: "/" },
        ]}
      />
      {/* Stats Dashboard */}
      <HeroStats />
      {/* Filter and search */}
      <SearchControls />
    </>
  );
};

export default SearchPage;
