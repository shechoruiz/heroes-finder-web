import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Hero } from "../types/hero.interface";
import type { HeroesResponse } from "../types/get-heroes.response";

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
  status: "active",
  category: "hero",
  universe: "DC",
};

vi.mock("../actions/get-heroes-by-page.action", () => ({
  getHeroesByPageAction: vi.fn(),
}));

import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";
import { usePaginatedHero } from "./usePaginatedHero";

const createTestClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderHookWithClient = <T,>(hook: () => T) => {
  const client = createTestClient();
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("usePaginatedHero", () => {
  it("fetches heroes for the requested page, limit and category", async () => {
    const response: HeroesResponse = { heroes: [hero], total: 1, pages: 1 };
    vi.mocked(getHeroesByPageAction).mockResolvedValueOnce(response);

    const { result } = renderHookWithClient(() =>
      usePaginatedHero(2, 6, "villain"),
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getHeroesByPageAction).toHaveBeenCalledWith(2, 6, "villain");
    expect(result.current.data).toEqual(response);
  });

  it("exposes the error when the action rejects", async () => {
    vi.mocked(getHeroesByPageAction).mockRejectedValueOnce(
      new Error("network down"),
    );

    const { result } = renderHookWithClient(() =>
      usePaginatedHero(1, 6, "all"),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});
