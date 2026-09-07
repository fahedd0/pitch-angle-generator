# Pitch Angle Generator

A small tool for PR consultants: paste a client announcement, pick which
journalist archetypes you're targeting, and get a distinct pitch angle —
subject line, hook, and a proof point grounded in the announcement — for
each one.

Built for the Pathos Communications take-home. Full spec: [`PRD.md`](./PRD.md).

## Why this

PR consultants often need to reframe the same announcement multiple ways —
a funding round matters differently to a trade reporter than to a local news
desk. Doing that by hand for every announcement is slow. This automates the
first draft so a consultant can start from angles instead of a blank page.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Anthropic API (Claude) for angle generation, called server-side
- Vitest for unit tests

## Running locally

```bash
npm install
```

Add your Anthropic API key to a `.env.local` file:

```
ANTHROPIC_API_KEY=your-key-here
```

Then:

```bash
npm run dev
```

Open http://localhost:3000.

## Tests

```bash
npm test
```

## How this was built

Built with Claude Code, directing implementation in small, reviewable
commits rather than one large generation — see commit history. The
generation prompt explicitly instructs the model to ground each proof point
in details actually present in the input announcement, rather than
inventing specifics.

## What's out of scope (by design)

- No real journalist/media database or contact matching
- No sending/outreach capability
- No user accounts or persistence — session-only

## What I'd do next

- Real journalist/outlet suggestions per archetype (not just angles)
- Tone presets per client (e.g. formal vs. scrappy startup voice)
- Save/export a set of angles as a one-pager