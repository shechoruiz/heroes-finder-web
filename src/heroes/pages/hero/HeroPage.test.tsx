import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Hero } from "../../types/hero.interface";
import { HeroPage } from "./HeroPage";

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
  status: "Activo",
  category: "Héroe",
  universe: "DC",
};

vi.mock("../../hooks/useHeroInfo", () => ({
  useHeroInfo: vi.fn(),
}));

import { useHeroInfo } from "../../hooks/useHeroInfo";

const HomeStub = () => <h1>Home page</h1>;

const renderHeroPage = (initialPath = "/heroes/batman") => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<HomeStub />} />
          <Route path="/heroes/:idSlug" element={<HeroPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

const mockHeroData = (overrides: Partial<ReturnType<typeof useHeroInfo>> = {}) =>
  vi.mocked(useHeroInfo).mockReturnValue({
    data: hero,
    isLoading: false,
    isSuccess: true,
    isError: false,
    ...overrides,
  } as never);

// Radix activa el tab en onMouseDown (button 0), no en click: la
// interacción real de un usuario dispara ambas secuencias.
const openTab = (name: RegExp) => {
  const trigger = screen.getByRole("tab", { name });
  fireEvent.mouseDown(trigger);
  fireEvent.click(trigger);
};

const waitForHeader = async () =>
  waitFor(() =>
    expect(screen.getByRole("heading", { name: "Bruce Wayne" })).toBeTruthy(),
  );

beforeEach(() => {
  vi.clearAllMocks();
});

describe("HeroPage", () => {
  it("renders the hero header with alias, name and description", async () => {
    mockHeroData();
    renderHeroPage();

    await waitForHeader();

    expect(screen.getByText("Batman")).toBeTruthy();
    expect(screen.getByText("El caballero de la noche")).toBeTruthy();
    expect(screen.getByText("Héroe")).toBeTruthy();
    expect(screen.getByText("Activo")).toBeTruthy();
    expect(screen.getByText("DC")).toBeTruthy();
  });

  it("renders the stats with the hero values", async () => {
    mockHeroData();
    renderHeroPage();

    await waitForHeader();

    expect(screen.getAllByText("Fuerza").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Inteligencia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Velocidad").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Resistencia").length).toBeGreaterThan(0);
    expect(screen.getByText("Comparación de Habilidades")).toBeTruthy();
  });

  it("shows the hero powers when the powers tab is open", async () => {
    mockHeroData();
    renderHeroPage();

    await waitForHeader();

    openTab(/Poderes/);

    expect(screen.getByText("Superpoderes")).toBeTruthy();
    expect(screen.getByText("Genio táctico")).toBeTruthy();
    expect(screen.getByText("Detective")).toBeTruthy();
  });

  it("shows the hero team when the team tab is open", async () => {
    mockHeroData();
    renderHeroPage();

    await waitForHeader();

    openTab(/Equipo/);

    expect(screen.getByText("Afiliación de Equipo")).toBeTruthy();
    expect(screen.getByText("Justice League")).toBeTruthy();
  });

  it("shows the hero information and computes active years", async () => {
    mockHeroData();
    renderHeroPage();

    await waitForHeader();

    openTab(/Información/);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText("Detalles Personales")).toBeTruthy();
    expect(screen.getByText(`${currentYear - 1939} años`)).toBeTruthy();
    expect(screen.getByText("1939")).toBeTruthy();
  });

  it("redirects to / when the hero is not found", async () => {
    mockHeroData({ isError: true, data: undefined });
    renderHeroPage("/heroes/unknown");

    await waitFor(() => expect(screen.getByText("Home page")).toBeTruthy());
  });
});
