"use client";

import { useState } from "react";

const ARCHETYPES = [
  "Trade Press",
  "Business/Finance Press",
  "Local News",
  "Tech Press",
] as const;

const ARCHETYPE_COLORS: Record<string, string> = {
  "Trade Press": "#2451B3",
  "Business/Finance Press": "#1C7C54",
  "Local News": "#B3542B",
  "Tech Press": "#6C4FC7",
};

type PitchResult = {
  archetype: string;
  subject_line: string;
  hook: string;
  proof_point: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PitchResult[]>([]);
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
    setError("");

    if (announcement.trim().length < 20) {
      setError("Announcement must be at least 20 characters.");
      return;
    }

    if (selectedArchetypes.length === 0) {
      setError("Select at least one archetype.");
      return;
    }

    setLoading(true);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <main className="max-w-xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-[2.75rem] leading-[1.1] text-[#1B1B18]">
            Pitch Angle Generator
          </h1>
          <p className="mt-3 text-[15px] text-[#6E6B63] max-w-sm">
            Paste the news. Pick who needs to hear it. Get an angle worth a
            journalist&apos;s time for each.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="announcement"
              className="block text-sm text-[#1B1B18] mb-2"
            >
              Client announcement
            </label>
            <textarea
              id="announcement"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              rows={6}
              minLength={20}
              maxLength={1000}
              required
              placeholder="Client X closed a $5M Series A led by Y Capital to expand payment infrastructure across the GCC..."
              className="w-full border border-[#E5E3DC] bg-white px-4 py-3 text-[15px] text-[#1B1B18] placeholder:text-[#A8A59C] focus:outline-none focus:border-[#2451B3] transition-colors"
            />
          </div>

          <div>
            <p className="text-sm text-[#1B1B18] mb-3">Target archetypes</p>
            <div className="flex flex-wrap gap-2">
              {ARCHETYPES.map((archetype) => {
                const selected = selectedArchetypes.includes(archetype);
                return (
                  <label
                    key={archetype}
                    className={`text-sm px-3 py-1.5 border cursor-pointer transition-colors ${
                      selected
                        ? "border-[#1B1B18] bg-[#1B1B18] text-white"
                        : "border-[#E5E3DC] text-[#1B1B18] hover:border-[#1B1B18]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleArchetype(archetype)}
                      className="hidden"
                    />
                    {archetype}
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#2451B3] text-white text-sm px-5 py-2.5 hover:bg-[#1D3F91] disabled:opacity-50 transition-colors"
          >
            {loading ? "Generating…" : "Generate pitch angles"}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-4 text-sm text-[#B3542B]">
            {error}
          </p>
        )}

        {results.length > 0 && (
          <section aria-label="Pitch angle results" className="mt-16 space-y-8">
            {results.map((result) => (
              <article
                key={result.archetype}
                style={{
                  borderLeftColor:
                    ARCHETYPE_COLORS[result.archetype] ?? "#1B1B18",
                }}
                className="border-l-[3px] pl-5 py-1"
              >
                <p className="text-xs text-[#6E6B63] mb-1">
                  {result.archetype}
                </p>
                <h2 className="font-serif text-lg text-[#1B1B18] mb-2">
                  {result.subject_line}
                </h2>
                <p className="text-[15px] text-[#3B3A36] mb-2">
                  {result.hook}
                </p>
                <p className="text-sm text-[#6E6B63] italic mb-3">
                  {result.proof_point}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${result.subject_line}\n\n${result.hook}\n\n${result.proof_point}`
                    )
                  }
                  className="text-xs text-[#2451B3] hover:underline"
                >
                  Copy
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}