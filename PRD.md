# PRD: Pitch Angle Generator

## Problem
PR consultants spend significant time turning a single client announcement into
multiple pitch angles tailored to different journalists. The same announcement
needs to be framed differently for a trade reporter, a business reporter, and a
local news reporter — writing all of these by hand for every announcement is
slow and inconsistent.

## Goal
A small internal tool that takes one client announcement and generates several
distinct, ready-to-use pitch angles, each tailored to a specific journalist
archetype, with a subject line and a short hook.

## User
A PR consultant preparing outreach for a new client announcement.

## Core flow
1. User pastes/types a client announcement (plain text, a few sentences).
2. User selects (or the app defaults to) a set of journalist archetypes to
   target — e.g. Trade Press, Business/Finance Press, Local News, Tech Press.
3. App calls an LLM to generate one pitch angle per archetype:
   - Subject line (under ~10 words)
   - 2–3 sentence hook explaining why this archetype's readers would care
   - One suggested proof point pulled directly from the announcement
4. Results are displayed as cards, one per archetype, copyable to clipboard.

## Inputs
- `announcement`: free text, required, 20–1000 chars
- `archetypes`: multi-select, required, at least 1 selected (default: all 4)

## Outputs
Per archetype:
- `subject_line`: string
- `hook`: string
- `proof_point`: string (must be traceable to something in the input announcement)

## Explicitly out of scope
- No real journalist/media database or contact matching
- No sending/outreach capability (no email, SMS, etc.)
- No user accounts, auth, or persistence — session-only
- No editing/regeneration history beyond the current result set

## Success criteria for this build
- Given a real announcement, output is specific to that announcement (not
  generic filler) and clearly differentiated across archetypes
- App handles a bad/empty input gracefully (validation, no silent failure)
- At least one AI-generated inaccuracy is caught and fixed during development,
  and documented (this is for the "verification" story in the demo video)

## Tech
Next.js (App Router) + TypeScript + Tailwind CSS v4, deployed to Vercel.
LLM calls via Anthropic API, server-side route handler (key never exposed
client-side).
