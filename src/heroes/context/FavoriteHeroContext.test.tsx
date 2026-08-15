import { act, renderHook } from "@testing-library/react";
import { useContext } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Hero } from "../types/hero.interface";
import {
  FavoriteHeroContext,
  FavoriteHeroProvider,
} from "./FavoriteHeroContext";

const hero: Hero = {
  id: "1",
  name: "Batman",
  slug: "batman",
  alias: "Bruce Wayne",
  powers: ["Genio táctico", "Detective"],
  description: "El caballero de la noche",
  strength: 5,
  intelligence: 9,
  speed: 4,
  durability: 5,
  team: "Justice League",
  image: "batman.jpg",
  firstAppearance: "1939",
  status: "active",
  category: "hero",
  universe: "DC",
};

const anotherHero: Hero = {
  ...hero,
  id: "2",
  name: "Joker",
  slug: "joker",
  alias: "Jack Napier",
  team: "Injustice League",
};

const useFavoriteContext = () => useContext(FavoriteHeroContext);

const renderProvider = () => renderHook(() => useFavoriteContext(), {
  wrapper: FavoriteHeroProvider,
});

describe("FavoriteHeroProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts empty when localStorage has no favorites", () => {
    const { result } = renderProvider();

    expect(result.current.favorites).toEqual([]);
    expect(result.current.favoriteCount).toBe(0);
  });

  it("adds a hero when toggled for the first time", () => {
    const { result } = renderProvider();

    act(() => result.current.toggleFavorite(hero));

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]).toEqual(hero);
    expect(result.current.favoriteCount).toBe(1);
    expect(result.current.isFavorite(hero)).toBe(true);
  });

  it("removes the hero when toggled twice", () => {
    const { result } = renderProvider();

    act(() => result.current.toggleFavorite(hero));
    act(() => result.current.toggleFavorite(hero));

    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.favoriteCount).toBe(0);
    expect(result.current.isFavorite(hero)).toBe(false);
  });

  it("keeps multiple favorites independent by id", () => {
    const { result } = renderProvider();

    act(() => result.current.toggleFavorite(hero));
    act(() => result.current.toggleFavorite(anotherHero));

    expect(result.current.favoriteCount).toBe(2);
    expect(result.current.isFavorite(hero)).toBe(true);
    expect(result.current.isFavorite(anotherHero)).toBe(true);

    act(() => result.current.toggleFavorite(hero));

    expect(result.current.favoriteCount).toBe(1);
    expect(result.current.isFavorite(hero)).toBe(false);
    expect(result.current.isFavorite(anotherHero)).toBe(true);
  });

  it("persists favorites in localStorage", () => {
    const { result } = renderProvider();

    act(() => result.current.toggleFavorite(hero));

    const stored = JSON.parse(localStorage.getItem("favorites") ?? "[]");
    expect(stored).toEqual([hero]);
  });

  it("hydrates favorites from localStorage on mount", () => {
    localStorage.setItem("favorites", JSON.stringify([hero]));

    const { result } = renderProvider();

    expect(result.current.favoriteCount).toBe(1);
    expect(result.current.isFavorite(hero)).toBe(true);
  });

  it("removes a favorite already stored in localStorage when toggled", () => {
    localStorage.setItem("favorites", JSON.stringify([hero]));

    const { result } = renderProvider();

    act(() => result.current.toggleFavorite(hero));

    expect(result.current.favoriteCount).toBe(0);
    expect(result.current.isFavorite(hero)).toBe(false);
  });
});
