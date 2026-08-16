import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Hero } from "../types/hero.interface";
import type { SummaryInformationResponse } from "../types/summary-information.response";
import { FavoriteHeroProvider } from "../context/FavoriteHeroContext";
import { HeroStats } from "./HeroStats";

const hero: Hero = {
  id: "1",
  name: "Clark Kent",
  slug: "clark-kent",
  alias: "Superman",
  powers: ["Súper fuerza"],
  description: "El Último Hijo de Krypton",
  strength: 10,
  intelligence: 8,
  speed: 9,
  durability: 10,
  team: "Liga de la Justicia",
  image: "1.jpeg",
  firstAppearance: "1938",
  status: "Active",
  category: "Hero",
  universe: "DC",
};

const summary: SummaryInformationResponse = {
  totalHeroes: 10,
  heroCount: 6,
  villainCount: 4,
  strongestHero: hero,
  smartestHero: hero,
};

vi.mock("../hooks/useHeroSummary", () => ({
  useHeroSummary: vi.fn(),
}));

import { useHeroSummary } from "../hooks/useHeroSummary";

const renderStats = () =>
  render(
    <FavoriteHeroProvider>
      <HeroStats />
    </FavoriteHeroProvider>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("HeroStats", () => {
  it("shows a loading message while the summary is not available", () => {
    vi.mocked(useHeroSummary).mockReturnValue({ data: undefined } as never);

    renderStats();

    expect(screen.getByText("Cargando...")).toBeTruthy();
  });

  it("renders the four stat cards with the summary values", () => {
    vi.mocked(useHeroSummary).mockReturnValue({
      data: summary,
      isLoading: false,
      isSuccess: true,
      isError: false,
    } as never);

    renderStats();

    expect(screen.getByText("Total de personajes")).toBeTruthy();
    expect(screen.getByText("10")).toBeTruthy();
    expect(screen.getByText("6 Héroes")).toBeTruthy();
    expect(screen.getByText("4 Villanos")).toBeTruthy();

    expect(screen.getByText("Favoritos")).toBeTruthy();
    // El texto real usa un carácter compuesto (a + acento combinante)
    expect(screen.getByText(/fuerte/i)).toBeTruthy();
    // strongestHero y smartestHero usan el mismo héroe en el fixture
    expect(screen.getAllByText("Superman")).toHaveLength(2);
    expect(screen.getByText("Fuerza: 10/10")).toBeTruthy();
  });
});
