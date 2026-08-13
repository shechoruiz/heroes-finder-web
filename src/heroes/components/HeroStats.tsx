import { useContext } from "react";
import { Heart, Trophy, Users, Zap } from "lucide-react";

import { HeroStatCard } from "./HeroStatCard";
import { Badge } from "@/components/ui/badge";
import { useHeroSummary } from "../hooks/useHeroSummary";
import { FavoriteHeroContext } from "../context/FavoriteHeroContext";

export const HeroStats = () => {
  const { data: summary } = useHeroSummary();
  const { favoriteCount } = useContext(FavoriteHeroContext);

  if (!summary) return <h1>Loading...</h1>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Total de personajes */}
      <HeroStatCard
        title="Total de personajes"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">{summary?.totalHeroes}</div>
        <div className="flex gap-1 mt-2">
          <Badge variant="secondary" className="text-xs">
            {summary?.heroCount} Heroes
          </Badge>
          <Badge variant="destructive" className="text-xs">
            {summary?.villainCount} Villains
          </Badge>
        </div>
      </HeroStatCard>

      {/* Favoritos */}
      <HeroStatCard title="Favoritos" icon={<Heart className="h-4 w-4" />}>
        <div className="text-2xl font-bold text-red-600">{favoriteCount}</div>
        <p className="text-xs text-muted-foreground">
          {((favoriteCount / summary.totalHeroes) * 100).toFixed(2)}% de{" "}
          {summary?.totalHeroes}
        </p>
      </HeroStatCard>

      {/* Más fuerte */}
      <HeroStatCard
        title="Más fuerte"
        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">{summary?.strongestHero.alias}</div>
        <p className="text-xs text-muted-foreground">
          Fuerza: {summary?.strongestHero.strength}/10
        </p>
      </HeroStatCard>

      {/* Más inteligente */}
      <HeroStatCard
        title="Más inteligente"
        icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">{summary?.smartestHero.alias}</div>
        <p className="text-xs text-muted-foreground">
          Inteligencia: {summary?.smartestHero.intelligence}/10
        </p>
      </HeroStatCard>
    </div>
  );
};
