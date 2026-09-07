"use client";

import { useState } from "react";

const ARCHETYPES = [
  "Trade Press",
  "Business/Finance Press",
  "Local News",
  "Tech Press",
] as const;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");

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


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcement, archetypes: selectedArchetypes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResults(data.results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      {loading && <p>Generating...</p>}
      {error && <p>{error}</p>}
    </main>
  );
}