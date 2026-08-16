import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Hero } from "@/heroes/types/hero.interface";
import type { HeroesResponse } from "@/heroes/types/get-heroes.response";
import type { SummaryInformationResponse } from "@/heroes/types/summary-information.response";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";
import { appRoutes } from "./app.router";

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

const heroesResponse: HeroesResponse = { heroes: [hero], total: 1, pages: 1 };

const summary: SummaryInformationResponse = {
  totalHeroes: 10,
  heroCount: 6,
  villainCount: 4,
  strongestHero: hero,
  smartestHero: hero,
};

vi.mock("@/heroes/hooks/usePaginatedHero", () => ({
  usePaginatedHero: vi.fn(),
}));

vi.mock("@/heroes/hooks/useHeroSummary", () => ({
  useHeroSummary: vi.fn(),
}));

vi.mock("@/heroes/hooks/useSearchHero", () => ({
  useSearchHero: vi.fn(),
}));

vi.mock("@/heroes/hooks/useHeroInfo", () => ({
  useHeroInfo: vi.fn(),
}));

import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary";
import { useSearchHero } from "@/heroes/hooks/useSearchHero";
import { useHeroInfo } from "@/heroes/hooks/useHeroInfo";

const mockDataHooks = () => {
  vi.mocked(usePaginatedHero).mockReturnValue({
    data: heroesResponse,
    isLoading: false,
    isSuccess: true,
    isError: false,
  } as never);
  vi.mocked(useHeroSummary).mockReturnValue({
    data: summary,
    isLoading: false,
    isSuccess: true,
    isError: false,
  } as never);
  vi.mocked(useSearchHero).mockReturnValue({
    data: [hero],
    isLoading: false,
    isSuccess: true,
    isError: false,
  } as never);
  vi.mocked(useHeroInfo).mockReturnValue({
    data: hero,
    isLoading: false,
    isSuccess: true,
    isError: false,
  } as never);
};

const renderApp = () => {
  const router = createMemoryRouter(appRoutes, { initialEntries: ["/"] });
  render(
    <FavoriteHeroProvider>
      <RouterProvider router={router} />
    </FavoriteHeroProvider>,
  );
  return router;
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  mockDataHooks();
});

describe("app.router", () => {
  it("renders HomePage at the index route", async () => {
    renderApp();

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Universo de superheroes" }),
      ).toBeTruthy(),
    );

    expect(screen.getAllByRole("link", { name: "Inicio" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("tab", { name: /Todos los personajes/ })).toBeTruthy();
  });

  it("navigates to the search page", async () => {
    const router = renderApp();

    await router.navigate("/search");

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Búsqueda de superhéroes" }),
      ).toBeTruthy(),
    );
  });

  it("navigates to the hero detail page", async () => {
    const router = renderApp();

    await router.navigate("/heroes/batman");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Bruce Wayne" })).toBeTruthy(),
    );
  });

  it("redirects unknown routes to the home page", async () => {
    const router = renderApp();

    await router.navigate("/no-existe");

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Universo de superheroes" }),
      ).toBeTruthy(),
    );
  });

  it("navigates to search from the menu link", async () => {
    renderApp();

    await waitFor(() =>
      expect(screen.getAllByRole("link", { name: "Inicio" }).length).toBeGreaterThan(0),
    );

    const searchLink = screen.getByRole("link", { name: "Búsqueda" });
    searchLink.click();

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Búsqueda de superhéroes" }),
      ).toBeTruthy(),
    );
  });
});