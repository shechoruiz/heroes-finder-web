import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heart } from "lucide-react";
import { HeroStatCard } from "./HeroStatCard";

describe("HeroStatCard", () => {
  it("renders the title, the icon and the children", () => {
    render(
      <HeroStatCard title="Favoritos" icon={<Heart data-testid="icon" />}>
        <div>42</div>
      </HeroStatCard>,
    );

    expect(screen.getByText("Favoritos")).toBeTruthy();
    expect(screen.getByTestId("icon")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
  });
});
