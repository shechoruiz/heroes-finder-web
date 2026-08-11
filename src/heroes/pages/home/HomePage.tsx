import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";
import { getHeroesByPageAction } from "@/heroes/actions/get-heroes-by-page.action";

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "favorites" | "heroes" | "villains"
  >("all");

  const { data: heroesResponse } = useQuery({
    queryKey: ["heroes"],
    queryFn: () => getHeroesByPageAction(),
    staleTime: 1000 * 60 * 5,
  });

  console.log({ heroesResponse });

  return (
    <>
      {/* Header */}
      <CustomJumbotron title="Universo de superheroes" />

      <CustomBreadcrumbs currentPage="Super heroes" />

      {/* Stats Dashboard */}
      <HeroStats />

      {/* Tabs */}
      <Tabs value={activeTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
            All Characters (16)
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="flex items-center gap-2"
            onClick={() => setActiveTab("favorites")}
          >
            Favorites (3)
          </TabsTrigger>
          <TabsTrigger value="heroes" onClick={() => setActiveTab("heroes")}>
            Heroes (12)
          </TabsTrigger>
          <TabsTrigger
            value="villains"
            onClick={() => setActiveTab("villains")}
          >
            Villains (2)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {/* Mostrar todos los personajes */}
          <HeroGrid heroes={heroesResponse?.heroes ?? []} />
        </TabsContent>
        <TabsContent value="favorites">
          {/* Mostrar personajes favoritos */}
          <h1>Personajes favoritos</h1>
          {/* <HeroGrid /> */}
        </TabsContent>
        <TabsContent value="heroes">
          {/* Mostrar heroes */}
          <h1>Heroes</h1>
          {/* <HeroGrid /> */}
        </TabsContent>
        <TabsContent value="villains">
          {/* Mostrar villanos */}
          <h1>Villanos</h1>
          {/* <HeroGrid /> */}
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
      <CustomPagination totalPages={8} />
    </>
  );
};
