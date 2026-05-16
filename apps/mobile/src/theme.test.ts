import { describe, expect, it } from "vitest";
import { colors } from "./theme";

describe("mobile theme", () => {
  it("uses Familia Connect brand colors", () => {
    expect(colors.moss).toBe("#3f6f52");
    expect(colors.paper).toBe("#f7f4ec");
  });
});
