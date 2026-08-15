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

vi.mock("../actions/get-hero.action", () => ({
  getHeroAction: vi.fn(),
}));

import { getHeroAction } from "../actions/get-hero.action";
import { useHeroInfo } from "./useHeroInfo";

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

describe("useHeroInfo", () => {
  it("fetches the hero by id or slug", async () => {
    vi.mocked(getHeroAction).mockResolvedValueOnce(hero);

    const { result } = renderHookWithClient(() => useHeroInfo("batman"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getHeroAction).toHaveBeenCalledWith("batman");
    expect(result.current.data).toEqual(hero);
  });

  it("does not retry when the hero is not found", async () => {
    vi.mocked(getHeroAction).mockRejectedValueOnce(new Error("not found"));

    const { result } = renderHookWithClient(() => useHeroInfo("unknown"));

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(getHeroAction).toHaveBeenCalledTimes(1);
  });
});
