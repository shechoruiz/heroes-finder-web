import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import type { Hero } from "../types/hero.interface";
import { FavoriteHeroProvider } from "../context/FavoriteHeroContext";
import { HeroGridCard } from "./HeroGridCard";

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
  image: "/images/batman.jpg",
  firstAppearance: "1939",
  status: "Active",
  category: "Hero",
  universe: "DC",
};

const HeroDetailStub = () => <h1>Detalle del héroe</h1>;

const renderCard = (heroToRender = hero) =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <FavoriteHeroProvider>
        <Routes>
          <Route path="/" element={<HeroGridCard hero={heroToRender} />} />
          <Route path="/heroes/:idSlug" element={<HeroDetailStub />} />
        </Routes>
      </FavoriteHeroProvider>
    </MemoryRouter>,
  );

beforeEach(() => {
  localStorage.clear();
});

describe("HeroGridCard", () => {
  it("renders the hero alias, name, category and team", () => {
    renderCard();

    expect(screen.getByRole("heading", { name: "Bruce Wayne" })).toBeTruthy();
    expect(screen.getByText("Batman")).toBeTruthy();
    expect(screen.getByText("Hero")).toBeTruthy();
    expect(screen.getByText("Justice League")).toBeTruthy();
    expect(screen.getByText("El caballero de la noche")).toBeTruthy();
  });

  it("renders the hero stats labels and first appearance", () => {
    renderCard();

    expect(screen.getByText("Fuerza")).toBeTruthy();
    expect(screen.getByText("Inteligencia")).toBeTruthy();
    expect(screen.getByText("Velocidad")).toBeTruthy();
    expect(screen.getByText("Resistencia")).toBeTruthy();
    expect(screen.getByText("Primera aparición: 1939")).toBeTruthy();
  });

  it("renders the powers without a counter when there are three or fewer", () => {
    renderCard();

    expect(screen.getByText("Genio táctico")).toBeTruthy();
    expect(screen.getByText("Detective")).toBeTruthy();
    expect(screen.queryByText(/más/)).toBeNull();
  });

  it("shows the extra powers counter only when there are more than three", () => {
    const heroWithManyPowers: Hero = {
      ...hero,
      powers: ["a", "b", "c", "d", "e"],
    };

    renderCard(heroWithManyPowers);

    expect(screen.getByText("+2 más")).toBeTruthy();
  });

  it("toggles the favorite when the heart button is clicked", () => {
    renderCard();

    const favoriteButton = screen.getByRole("button", {
      name: "Agregar a favoritos",
    });

    fireEvent.click(favoriteButton);

    expect(localStorage.getItem("favorites")).toContain("batman");
    expect(
      screen.getByRole("button", { name: "Quitar de favoritos" }),
    ).toBeTruthy();

    fireEvent.click(favoriteButton);

    const stored = localStorage.getItem("favorites") ?? "[]";
    expect(JSON.parse(stored)).toEqual([]);
  });

  it("navigates to the hero detail when the image is clicked", () => {
    renderCard();

    const image = screen.getByAltText("Batman");
    fireEvent.click(image);

    expect(screen.getByText("Detalle del héroe")).toBeTruthy();
  });
});
