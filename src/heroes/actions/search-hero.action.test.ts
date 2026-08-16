import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Hero } from "../types/hero.interface";

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
import { searchHeroAction } from "./search-hero.action";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("searchHeroAction", () => {
  it("returns an empty list without calling the api when no filters are provided", async () => {
    const result = await searchHeroAction();

    expect(result).toEqual([]);
    expect(heroApi.get).not.toHaveBeenCalled();
  });

  it("fetches heroes passing every filter as query params", async () => {
    vi.mocked(heroApi.get).mockResolvedValueOnce({ data: [hero] } as never);

    const result = await searchHeroAction({
      name: "super",
      team: "Liga de la Justicia",
      category: "Hero",
      universe: "DC",
      status: "Active",
      strength: "5",
    });

    expect(heroApi.get).toHaveBeenCalledWith("/search", {
      params: {
        name: "super",
        team: "Liga de la Justicia",
        category: "Hero",
        universe: "DC",
        status: "Active",
        strength: "5",
      },
    });
    expect(result).toEqual([{ ...hero, image: `${BASE_URL}/images/1.jpeg` }]);
  });

  it("composes the full image url for every hero", async () => {
    vi.mocked(heroApi.get).mockResolvedValueOnce({
      data: [{ ...hero, image: "3.jpeg" }],
    } as never);

    const result = await searchHeroAction({ name: "super" });

    expect(result[0].image).toBe(`${BASE_URL}/images/3.jpeg`);
  });

  it("propagates the error when the api call fails", async () => {
    vi.mocked(heroApi.get).mockRejectedValueOnce(new Error("network down"));

    await expect(searchHeroAction({ name: "super" })).rejects.toThrow(
      "network down",
    );
  });
});
