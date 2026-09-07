"use client";

import { useState } from "react";

const ARCHETYPES = [
  "Trade Press",
  "Business/Finance Press",
  "Local News",
  "Tech Press",
] as const;

export default function Home() {
  const [announcement, setAnnouncement] = useState("");
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([
    ...ARCHETYPES,
  ]);

  function toggleArchetype(archetype: string) {
    setSelectedArchetypes((prev) =>
      prev.includes(archetype)
        ? prev.filter((a) => a !== archetype)
        : [...prev, archetype]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log({ announcement, selectedArchetypes });
    // API call wired in Step 4
  }

  return (
    <main>
      <h1>Pitch Angle Generator</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="announcement">Client announcement</label>
        <textarea
          id="announcement"
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          rows={6}
          minLength={20}
          maxLength={1000}
          required
        />

        <fieldset>
          <legend>Target archetypes</legend>
          {ARCHETYPES.map((archetype) => (
            <label key={archetype}>
              <input
                type="checkbox"
                checked={selectedArchetypes.includes(archetype)}
                onChange={() => toggleArchetype(archetype)}
              />
              {archetype}
            </label>
          ))}
        </fieldset>

        <button type="submit">Generate pitch angles</button>
      </form>
    </main>
  );
}