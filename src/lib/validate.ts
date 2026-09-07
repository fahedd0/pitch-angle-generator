export type ValidationResult = { valid: true } | { valid: false; error: string };

export function validatePitchInput(
  announcement: string,
  archetypes: string[]
): ValidationResult {
  if (announcement.trim().length < 20) {
    return { valid: false, error: "Announcement must be at least 20 characters." };
  }

  if (archetypes.length === 0) {
    return { valid: false, error: "Select at least one archetype." };
  }

  return { valid: true };
}