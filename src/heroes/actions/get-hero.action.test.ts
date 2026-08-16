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
import { getHeroAction } from "./get-hero.action";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getHeroAction", () => {
  it("fetches the hero with the given id or slug", async () => {
    vi.mocked(heroApi.get).mockResolvedValueOnce({ data: hero } as never);

    const result = await getHeroAction("clark-kent");

    expect(heroApi.get).toHaveBeenCalledWith("/clark-kent");
    expect(result).toMatchObject({
      id: "1",
      alias: "Superman",
      team: "Liga de la Justicia",
    });
  });

  it("composes the full image url with the api base url", async () => {
    vi.mocked(heroApi.get).mockResolvedValueOnce({ data: hero } as never);

    const result = await getHeroAction("clark-kent");

    expect(result.image).toBe(`${BASE_URL}/images/1.jpeg`);
  });

  it("propagates the error when the api call fails", async () => {
    vi.mocked(heroApi.get).mockRejectedValueOnce(
      Object.assign(new Error("not found"), { status: 404 }),
    );

    await expect(getHeroAction("unknown")).rejects.toMatchObject({
      status: 404,
    });
  });
});
