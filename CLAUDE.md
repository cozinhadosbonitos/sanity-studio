# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sanity Studio for "Cozinha dos Bonitos", a recipe website. This is a content management studio — there is no frontend code here, only schema definitions and Sanity configuration.

- **Sanity project ID**: `nufe3788`
- **Dataset**: `production`
- **Plugins**: structureTool (desk), visionTool (GROQ playground)

## Commands

- `npm run dev` — Start local dev server
- `npm run build` — Build the studio
- `npm run deploy` — Deploy studio + GraphQL API
- `npm run deploy:studio` — Deploy studio only (`sanity deploy`)
- `npm run deploy:graphql` — Deploy GraphQL only (`sanity graphql deploy --force`)
- `npm run lint:eslint` — Run ESLint
- `npm run lint:prettier` — Check Prettier formatting
- `npm run lint:tsc` — TypeScript type checking
- `npm run format` — Auto-format with Prettier

## Code Style

- No semicolons, single quotes, trailing commas (es5) — enforced by Prettier
- TypeScript with strict mode
- ESLint flat config (`eslint.config.mjs`) with Prettier integration

## Schema Architecture

All schemas live in `schemas/` and are re-exported from `schemas/schema.ts`.

**Document types** (top-level content):

- `recipe` — Main content type. Has title, slug, photo, ingredients (array of `ingredient` objects), steps (array of text), description, servings, prep/cooking time, sweet/savoury booleans, courseType (enum: appetizer/dessert/main/snack/starter), tags.
- `food` — Lookup table of food items (name + photo). Referenced by ingredients.

**Object types** (embedded, not standalone):

- `ingredient` — Object with display string and a reference to `food`.
- `blockContent` — Minimal rich text (bold/italic/underline only, no lists or styles).

**Key relationships**: `recipe` → has array of `ingredient` → each references a `food` document.
