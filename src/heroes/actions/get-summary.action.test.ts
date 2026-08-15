import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Hero } from "../types/hero.interface";
import type { SummaryInformationResponse } from "../types/summary-information.response";

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
import { getSummaryAction } from "./get-summary.action";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getSummaryAction", () => {
  it("fetches the summary from the summary endpoint", async () => {
    const response: SummaryInformationResponse = {
      totalHeroes: 10,
      heroCount: 6,
      villainCount: 4,
      strongestHero: hero,
      smartestHero: hero,
    };
    vi.mocked(heroApi.get).mockResolvedValueOnce({ data: response } as never);

    const result = await getSummaryAction();

    expect(heroApi.get).toHaveBeenCalledWith("/summary");
    expect(result).toEqual(response);
  });

  it("propagates the error when the api call fails", async () => {
    vi.mocked(heroApi.get).mockRejectedValueOnce(new Error("network down"));

    await expect(getSummaryAction()).rejects.toThrow("network down");
  });
});
