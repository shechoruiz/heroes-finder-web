import { describe, expect, it } from "vitest";
import { getHeroAction } from "./get-hero.action";

// Test de INTEGRACIÓN: verifica el contrato real contra nest-heroes-backend.
// Depende del backend corriendo en VITE_API_URL; si no responde, el archivo
// se salta automáticamente para no romper la suite unitaria.
const BASE_URL = import.meta.env.VITE_API_URL;

const isBackendUp = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BASE_URL}/api/heroes/clark-kent`, {
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
};

const backendUp = await isBackendUp();

describe.skipIf(!backendUp)("getHeroAction (integration)", () => {
  it("should fetch hero data and return with complete image url", async () => {
    const result = await getHeroAction("clark-kent");
    const resultImageUrl = result.image;

    expect(resultImageUrl).toContain("1.jpeg");
    expect(result).toStrictEqual({
      id: "1",
      name: "Clark Kent",
      slug: "clark-kent",
      alias: "Superman",
      powers: [
        "Súper fuerza",
        "Vuelo",
        "Visión de calor",
        "Visión de rayos X",
        "Invulnerabilidad",
        "Súper velocidad",
      ],
      description:
        "El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.",
      strength: 10,
      intelligence: 8,
      speed: 9,
      durability: 10,
      team: "Liga de la Justicia",
      image: `${BASE_URL}/images/1.jpeg`,
      firstAppearance: "1938",
      status: "Active",
      category: "Hero",
      universe: "DC",
    });
  });

  it("should throw an error with status 404 if hero is not found", async () => {
    await expect(getHeroAction("batman-2")).rejects.toMatchObject({
      status: 404,
    });
  });
});
