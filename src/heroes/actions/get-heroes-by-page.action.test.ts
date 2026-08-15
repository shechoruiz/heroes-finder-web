import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Hero } from "../types/hero.interface";
import type { HeroesResponse } from "../types/get-heroes.response";

const BASE_URL = import.meta.env.VITE_API_URL;

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

vi.mock("../api/hero.api", () => ({
  heroApi: { get: vi.fn() },
}));

import { heroApi } from "../api/hero.api";
import { getHeroesByPageAction } from "./get-heroes-by-page.action";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getHeroesByPageAction", () => {
  it("fetches heroes with limit, offset and category params", async () => {
    const response: HeroesResponse = { heroes: [hero], total: 1, pages: 1 };
    vi.mocked(heroApi.get).mockResolvedValueOnce({ data: response } as never);

    const result = await getHeroesByPageAction(2, 6, "villain");

    expect(heroApi.get).toHaveBeenCalledWith("/", {
      params: { limit: 6, offset: 6, category: "villain" },
    });
    expect(result).toEqual({
      heroes: [{ ...hero, image: `${BASE_URL}/images/1.jpeg` }],
      total: 1,
      pages: 1,
    });
  });

  it("computes the offset from the page and limit", async () => {
    const response: HeroesResponse = { heroes: [], total: 0, pages: 0 };
    vi.mocked(heroApi.get).mockResolvedValueOnce({ data: response } as never);

    await getHeroesByPageAction(3, 10, "all");

    expect(heroApi.get).toHaveBeenCalledWith("/", {
      params: { limit: 10, offset: 20, category: "all" },
    });
  });

  it("uses default limit 6 and category all when not provided", async () => {
    const response: HeroesResponse = { heroes: [], total: 0, pages: 0 };
    vi.mocked(heroApi.get).mockResolvedValueOnce({ data: response } as never);

    await getHeroesByPageAction(1);

    expect(heroApi.get).toHaveBeenCalledWith("/", {
      params: { limit: 6, offset: 0, category: "all" },
    });
  });

  it("composes the full image url for every hero", async () => {
    const response: HeroesResponse = {
      heroes: [{ ...hero, image: "2.jpeg" }],
      total: 1,
      pages: 1,
    };
    vi.mocked(heroApi.get).mockResolvedValueOnce({ data: response } as never);

    const result = await getHeroesByPageAction(1);

    expect(result.heroes[0].image).toBe(`${BASE_URL}/images/2.jpeg`);
  });

  it("propagates the error when the api call fails", async () => {
    vi.mocked(heroApi.get).mockRejectedValueOnce(new Error("network down"));

    await expect(getHeroesByPageAction(1)).rejects.toThrow("network down");
  });
});
