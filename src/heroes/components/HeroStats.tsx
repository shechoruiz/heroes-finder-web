import { Badge } from "@/components/ui/badge";
import { Heart, Trophy, Users, Zap } from "lucide-react";
import { HeroStatCard } from "./HeroStatCard";

export const HeroStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Total de personajes */}
      <HeroStatCard
        title="Total de personajes"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">16</div>
        <div className="flex gap-1 mt-2">
          <Badge variant="secondary" className="text-xs">
            12 Heroes
          </Badge>
          <Badge variant="destructive" className="text-xs">
            2 Villains
          </Badge>
        </div>
      </HeroStatCard>

      {/* Favoritos */}
      <HeroStatCard title="Favoritos" icon={<Heart className="h-4 w-4" />}>
        <div className="text-2xl font-bold text-red-600">3</div>
        <p className="text-xs text-muted-foreground">18.8% of total</p>
      </HeroStatCard>

      {/* Más fuerte */}
      <HeroStatCard
        title="Más fuerte"
        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">Superman</div>
        <p className="text-xs text-muted-foreground">Strength: 10/10</p>
      </HeroStatCard>

      {/* Más inteligente */}
      <HeroStatCard
        title="Más inteligente"
        icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">Batman</div>
        <p className="text-xs text-muted-foreground">Intelligence: 10/10</p>
      </HeroStatCard>
    </div>
  );
};
