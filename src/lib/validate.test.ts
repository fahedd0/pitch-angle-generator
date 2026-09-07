import { describe, it, expect } from "vitest";
import { validatePitchInput } from "./validate";

describe("validatePitchInput", () => {
  it("rejects an announcement under 20 characters", () => {
    const result = validatePitchInput("too short", ["Trade Press"]);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe("Announcement must be at least 20 characters.");
    }
  });

  it("rejects an announcement that is only whitespace", () => {
    const result = validatePitchInput("                     ", ["Trade Press"]);
    expect(result.valid).toBe(false);
  });

  it("rejects zero selected archetypes", () => {
    const result = validatePitchInput(
      "This is a perfectly valid announcement text.",
      []
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe("Select at least one archetype.");
    }
  });

  it("accepts a valid announcement with at least one archetype", () => {
    const result = validatePitchInput(
      "This is a perfectly valid announcement text.",
      ["Trade Press"]
    );
    expect(result.valid).toBe(true);
  });
});