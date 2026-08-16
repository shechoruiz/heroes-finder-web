import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Hero } from "../types/hero.interface";
import type { SummaryInformationResponse } from "../types/summary-information.response";

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

vi.mock("../actions/get-summary.action", () => ({
  getSummaryAction: vi.fn(),
}));

import { getSummaryAction } from "../actions/get-summary.action";
import { useHeroSummary } from "./useHeroSummary";

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

describe("useHeroSummary", () => {
  it("fetches the summary information", async () => {
    const response: SummaryInformationResponse = {
      totalHeroes: 3,
      heroCount: 2,
      villainCount: 4,
      strongestHero: hero,
      smartestHero: hero,
    };
    vi.mocked(getSummaryAction).mockResolvedValueOnce(response);

    const { result } = renderHookWithClient(() => useHeroSummary());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getSummaryAction).toHaveBeenCalledOnce();
    expect(result.current.data).toEqual(response);
  });
});
