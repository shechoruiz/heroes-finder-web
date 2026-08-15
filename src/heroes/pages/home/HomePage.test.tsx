import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Hero } from "../../types/hero.interface";
import type { HeroesResponse } from "../../types/get-heroes.response";
import type { SummaryInformationResponse } from "../../types/summary-information.response";
import { FavoriteHeroProvider } from "../../context/FavoriteHeroContext";
import { HomePage } from "./HomePage";

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
  category: "hero",
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

vi.mock("../../hooks/usePaginatedHero", () => ({
  usePaginatedHero: vi.fn(),
}));

vi.mock("../../hooks/useHeroSummary", () => ({
  useHeroSummary: vi.fn(),
}));

import { usePaginatedHero } from "../../hooks/usePaginatedHero";
import { useHeroSummary } from "../../hooks/useHeroSummary";

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="location">{location.search}</div>;
};

const renderHome = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/"]}>
        <FavoriteHeroProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </FavoriteHeroProvider>
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
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
});

describe("HomePage", () => {
  it("renders the title and the four tabs with their counters", () => {
    renderHome();

    const heading = screen.getByRole("heading", {
      name: "Universo de superheroes",
    });
    expect(heading).toBeTruthy();

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[0].textContent).toContain("Todos los personajes");
    expect(tabs[0].textContent).toContain("10");
    expect(tabs[1].textContent).toContain("Favoritos");
    expect(tabs[1].textContent).toContain("0");
    expect(tabs[2].textContent).toContain("Héroes");
    expect(tabs[2].textContent).toContain("6");
    expect(tabs[3].textContent).toContain("Villanos");
    expect(tabs[3].textContent).toContain("4");
  });

  it("switches to the heroes tab and updates the URL with category and page", async () => {
    renderHome();

    fireEvent.click(screen.getByRole("tab", { name: /Héroes/ }));

    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).toContain(
        "tab=heroes",
      ),
    );

    const location = screen.getByTestId("location").textContent ?? "";
    expect(location).toContain("category=hero");
    expect(location).toContain("page=1");
  });

  it("switches to the villains tab", async () => {
    renderHome();

    fireEvent.click(screen.getByRole("tab", { name: /Villanos/ }));

    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).toContain(
        "tab=villains",
      ),
    );

    expect(screen.getByTestId("location").textContent).toContain(
      "category=villain",
    );
  });

  it("shows the heroes grid in the all tab", () => {
    renderHome();

    expect(screen.getByText("Batman")).toBeTruthy();
  });

  it("shows a favorite hero in the favorites tab", async () => {
    localStorage.setItem("favorites", JSON.stringify([hero]));
    renderHome();

    fireEvent.click(screen.getByRole("tab", { name: /Favoritos/ }));

    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).toContain(
        "tab=favorites",
      ),
    );

    expect(screen.getByText("Batman")).toBeTruthy();
  });

  it("renders pagination controls when there are pages", () => {
    renderHome();

    expect(
      screen.getByRole("button", { name: /Anterior/ }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Siguiente/ }),
    ).toBeTruthy();
  });
});
