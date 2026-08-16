import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import type { Hero } from "../types/hero.interface";
import { FavoriteHeroProvider } from "../context/FavoriteHeroContext";
import { HeroGrid } from "./HeroGrid";

const hero: Hero = {
  id: "1",
  name: "Batman",
  slug: "batman",
  alias: "Bruce Wayne",
  powers: ["Genio táctico"],
  description: "El caballero de la noche",
  strength: 5,
  intelligence: 9,
  speed: 4,
  durability: 5,
  team: "Justice League",
  image: "/images/batman.jpg",
  firstAppearance: "1939",
  status: "Active",
  category: "Hero",
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

describe("HeroGrid", () => {
  it("renders a card for every hero", () => {
    render(
      <MemoryRouter>
        <FavoriteHeroProvider>
          <HeroGrid heroes={[hero, anotherHero]} />
        </FavoriteHeroProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Bruce Wayne" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Jack Napier" })).toBeTruthy();
  });

  it("renders nothing when the list is empty", () => {
    const { container } = render(
      <MemoryRouter>
        <FavoriteHeroProvider>
          <HeroGrid heroes={[]} />
        </FavoriteHeroProvider>
      </MemoryRouter>,
    );

    expect(container.querySelectorAll("[data-slot='card']")).toHaveLength(0);
  });
});
