import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Hero } from "../types/hero.interface";

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

vi.mock("../actions/search-hero.action", () => ({
  searchHeroAction: vi.fn(),
}));

import { searchHeroAction } from "../actions/search-hero.action";
import { useSearchHero } from "./useSearchHero";

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

describe("useSearchHero", () => {
  it("passes the filters to the search action", async () => {
    vi.mocked(searchHeroAction).mockResolvedValueOnce([hero]);

    const { result } = renderHookWithClient(() =>
      useSearchHero("bat", "Justice League", "hero", "DC", "active", "5"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(searchHeroAction).toHaveBeenCalledWith({
      name: "bat",
      team: "Justice League",
      category: "hero",
      universe: "DC",
      status: "active",
      strength: "5",
    });
    expect(result.current.data).toEqual([hero]);
  });

  it("does not refetch when re-rendered with the same filters", async () => {
    vi.mocked(searchHeroAction).mockResolvedValueOnce([hero]);

    const { result, rerender } = renderHookWithClient(() =>
      useSearchHero("bat"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(searchHeroAction).toHaveBeenCalledTimes(1);

    rerender();

    expect(result.current.data).toEqual([hero]);
    expect(searchHeroAction).toHaveBeenCalledTimes(1);
  });
});
