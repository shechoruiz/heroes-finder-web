import { useContext, useMemo } from "react";
import { useSearchParams } from "react-router";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext";

export const HomePage = () => {
  // Que es el useSearchParams: son los parametros de consulta o query string que van después del signo de interrogación (?) en una URL (por ejemplo: /productos?categoria=ropa&orden=precio). Sirven para leer y modificar datos en la URL, como filtros o páginas.
  const [searchParams, setSearchParams] = useSearchParams();
  // La ventaja de los query parameters es que permite que el estado de la aplicacion sea persistenente y se pueda compartir. useState no puede hacer eso por si solo ya que el estado vive en memoria y se resetea cada vez que se recarga la pagina
  const activeTab = searchParams.get("tab") ?? "all";
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "6";
  const category = searchParams.get("category") ?? "all";
  // Por que se uso useMemo en este punto? Controlaremos que el valor del tab sea valido, si no lo es, lo cambiaremos por "all". usamos memo por que queremos que se ejecute solo cuando cambie el activeTab
  const selectedTab = useMemo(() => {
    const validTabs = ["all", "favorites", "heroes", "villains"];
    return validTabs.includes(activeTab) ? activeTab : "all";
  }, [activeTab]);

  const { data: heroesResponse } = usePaginatedHero(
    Number(page),
    Number(limit),
    category,
  );
  const { data: summary } = useHeroSummary();
  const { favoriteCount, favorites } = useContext(FavoriteHeroContext);

  return (
    <>
      {/* Header */}
      <CustomJumbotron title="Universo de superheroes" />

      <CustomBreadcrumbs currentPage="Superhéroes" />

      {/* Stats Dashboard */}
      <HeroStats />

      {/* Tabs */}
      <Tabs value={selectedTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="all"
            onClick={() =>
              setSearchParams((prev) => {
                prev.set("tab", "all");
                prev.set("category", "all");
                prev.set("page", "1");
                return prev;
              })
            }
          >
            Todos los personajes ({summary?.totalHeroes ?? 0})
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="flex items-center gap-2"
            onClick={() =>
              setSearchParams((prev) => {
                prev.set("tab", "favorites");
                //
                prev.set("page", "1");
                return prev;
              })
            }
          >
            Favoritos ({favoriteCount})
          </TabsTrigger>
          <TabsTrigger
            value="heroes"
            onClick={() =>
              setSearchParams((prev) => {
                prev.set("tab", "heroes");
                prev.set("category", "hero");
                prev.set("page", "1");
                return prev;
              })
            }
          >
            Héroes ({summary?.heroCount ?? 0})
          </TabsTrigger>
          <TabsTrigger
            value="villains"
            onClick={() =>
              setSearchParams((prev) => {
                prev.set("tab", "villains");
                prev.set("category", "villain");
                prev.set("page", "1");
                return prev;
              })
            }
          >
            Villanos ({summary?.villainCount ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {/* Mostrar todos los personajes */}
          <HeroGrid heroes={heroesResponse?.heroes ?? []} />
        </TabsContent>

        <TabsContent value="favorites">
          {/* Mostrar personajes favoritos */}
          <HeroGrid heroes={favorites} />
        </TabsContent>

        <TabsContent value="heroes">
          {/* Mostrar heroes */}
          <HeroGrid heroes={heroesResponse?.heroes ?? []} />
        </TabsContent>

        <TabsContent value="villains">
          {/* Mostrar villanos */}
          <HeroGrid heroes={heroesResponse?.heroes ?? []} />
        </TabsContent>
      </Tabs>

      {/* Results info */}
      {/* <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <p className="text-gray-600">Showing 6 of 16 characters</p>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Filtered
          </Badge>
        </div>
      </div> */}

      {/* Pagination */}
      {selectedTab !== "favorites" && (
        <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
      )}
    </>
  );
};
