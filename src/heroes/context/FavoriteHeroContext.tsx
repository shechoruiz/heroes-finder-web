/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import type { Hero } from "../types/hero.interface";

interface IFavoriteHeroContext {
  // State
  favorites: Hero[];
  favoriteCount: number;
  // Methods
  isFavorite: (hero: Hero) => boolean;
  toggleFavorite: (hero: Hero) => void;
}

export const FavoriteHeroContext = createContext({} as IFavoriteHeroContext);

const getFavoritesFromLocalStorage = (): Hero[] => {
  const favorites = localStorage.getItem("favorites");

  return favorites ? JSON.parse(favorites) : [];
};

export const FavoriteHeroProvider = ({ children }: React.PropsWithChildren) => {
  // Es una buena practica encapsular toda la logica de estado y las funciones que lo modifican dentro del propio componente proveedor, con el fin de centralizar y encapsular la gestión de estado, haciendo que el provider sea la unica fuente de verdad y unico responsable de la logica de negocio del estado
  const [favorites, setFavorites] = useState<Hero[]>(
    getFavoritesFromLocalStorage(),
  );

  const isFavorite = (hero: Hero) => {
    return favorites.some((h) => h.id === hero.id);
  };

  const toggleFavorite = (hero: Hero) => {
    const heroExist = favorites.find((h) => h.id === hero.id);

    if (heroExist) {
      setFavorites(favorites.filter((h) => h.id !== hero.id));
      return;
    }

    setFavorites([...favorites, hero]);
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoriteHeroContext
      value={{
        favorites: favorites,
        favoriteCount: favorites.length,
        isFavorite: isFavorite,
        toggleFavorite: toggleFavorite,
      }}
    >
      {children}
    </FavoriteHeroContext>
  );
};
