import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Hero } from "../../types/hero.interface";
import type { SummaryInformationResponse } from "../../types/summary-information.response";
import { FavoriteHeroProvider } from "../../context/FavoriteHeroContext";
import { SearchPage } from "./SearchPage";

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

const summary: SummaryInformationResponse = {
  totalHeroes: 10,
  heroCount: 6,
  villainCount: 4,
  strongestHero: hero,
  smartestHero: hero,
};

vi.mock("../../hooks/useSearchHero", () => ({
  useSearchHero: vi.fn(),
}));

vi.mock("../../hooks/useHeroSummary", () => ({
  useHeroSummary: vi.fn(),
}));

import { useSearchHero } from "../../hooks/useSearchHero";
import { useHeroSummary } from "../../hooks/useHeroSummary";

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="location">{location.search}</div>;
};

const renderSearch = (initialPath = "/search") => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialPath]}>
        <FavoriteHeroProvider>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
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
  vi.mocked(useSearchHero).mockReturnValue({
    data: [],
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

describe("SearchPage", () => {
  it("renders the search title and the input", () => {
    renderSearch();

    expect(
      screen.getByRole("heading", { name: "Búsqueda de superhéroes" }),
    ).toBeTruthy();
    expect(
      screen.getByPlaceholderText(
        "Buscar héroes, villanos, poderes, equipos...",
      ),
    ).toBeTruthy();
  });

  it("searches by name and updates the URL", async () => {
    renderSearch();

    fireEvent.change(
      screen.getByPlaceholderText(
        "Buscar héroes, villanos, poderes, equipos...",
      ),
      { target: { value: "bat" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).toContain("name=bat"),
    );

    expect(screen.getByTestId("location").textContent).toContain("name=bat");
  });

  it("triggers the search on Enter", async () => {
    renderSearch();

    const input = screen.getByPlaceholderText(
      "Buscar héroes, villanos, poderes, equipos...",
    );
    fireEvent.change(input, { target: { value: "super" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).toContain(
        "name=super",
      ),
    );
  });

  it("removes the name filter when the input is emptied", async () => {
    renderSearch("/search?name=bat");

    const input = screen.getByPlaceholderText(
      "Buscar héroes, villanos, poderes, equipos...",
    );
    fireEvent.change(input, { target: { value: "" } });

    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).not.toContain("name="),
    );
  });

  it("shows the search results in the grid", () => {
    vi.mocked(useSearchHero).mockReturnValue({
      data: [hero],
      isLoading: false,
      isSuccess: true,
      isError: false,
    } as never);
    renderSearch("/search?name=bat");

    expect(screen.getByText("Batman")).toBeTruthy();
  });

  it("updates the URL when an advanced filter is selected", async () => {
    renderSearch();

    fireEvent.click(screen.getByRole("button", { name: /Filtros/ }));

    await waitFor(() => expect(screen.getByText("Filtros avanzados")).toBeTruthy());

    fireEvent.change(screen.getByLabelText("Universo"), {
      target: { value: "DC" },
    });

    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).toContain(
        "universe=DC",
      ),
    );
  });

  it("updates the URL when the strength slider moves with the keyboard", async () => {
    renderSearch();

    fireEvent.click(screen.getByRole("button", { name: /Filtros/ }));

    await waitFor(() => expect(screen.getByText("Filtros avanzados")).toBeTruthy());

    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowRight" });

    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).toContain(
        "strength=1",
      ),
    );
  });

  it("clears all filters with the clear button", async () => {
    renderSearch(
      "/search?name=bat&team=Vengadores&strength=5&active-accordion=advance-filters",
    );

    fireEvent.click(screen.getByRole("button", { name: /Limpiar todo/ }));

    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).not.toContain("name="),
    );

    const location = screen.getByTestId("location").textContent ?? "";
    expect(location).not.toContain("team=");
    expect(location).not.toContain("strength=");
  });
});
