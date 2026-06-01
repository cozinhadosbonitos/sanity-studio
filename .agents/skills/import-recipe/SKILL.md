---
name: import-recipe
description: Import a recipe from a URL into the Cozinha dos Bonitos Sanity CMS. Fetches the page, extracts the recipe data, reuses or creates+publishes food documents for each ingredient, then creates the recipe as a draft for review. Use when the user provides a recipe URL and asks to import/add/save it to Sanity.
---

# Import recipe from URL

## Sanity target

- Project ID: `nufe3788`
- Dataset: `production`

Always pass these in the `resource` field of every Sanity MCP tool call.

## Inputs

The user provides one or more recipe URLs. If multiple, process them sequentially (each is independent, but Sanity tool calls in a single transaction can be batched).

## Procedure

### 1. Fetch the recipe page

Use `WebFetch` with a prompt that extracts:

- Title
- Short description (1-2 sentences, plain text — no markdown)
- Servings (number)
- Prep time in minutes (number)
- Cooking time in minutes (number)
- Whether it is sweet or savoury (boolean for each)
- Course type — must be one of: `appetizer`, `dessert`, `main`, `snack`, `starter`
- Full ingredient list, each as `{ display: "<quantity + descriptor>", food: "<canonical food name>" }` — `food` is the bare ingredient noun used to look up/create a `food` document (e.g. "Asparagus", "Olive oil", "Salad onions")
- Numbered cooking steps as an array of strings
- 3-8 tags (see "Tags" below for conventions)

## Tags

Every imported recipe must include 3-8 tags. Pick a mix from these categories — don't just list ingredients:

- **Key ingredients** (the headline 1-3): `lamb`, `asparagus`, `quinoa`, `salmon`, `halloumi`
- **Dish form / technique**: `risotto`, `pasta`, `traybake`, `one-pot`, `one-pan`, `baked`, `quiche`, `tagine`
- **Cuisine** (capitalised proper nouns): `Italian`, `Mediterranean`, `Moroccan`
- **Dietary**: `vegetarian`, `vegan`, `plant-based`, `gluten-free`
- **Occasion / feel**: `quick`, `weeknight`, `easy`, `comfort food`, `light`, `healthy`, `budget-friendly`
- **Season** (when clearly seasonal): `spring`, `summer`, `autumn`, `winter`

Conventions:

- Lowercase except cuisines/proper nouns (`Italian`, not `italian`).
- Hyphenate compound modifiers (`one-pot`, `plant-based`, `gluten-free`).
- Don't duplicate `courseType` (don't tag `main` if `courseType` is already `main`).
- Don't tag both `isSavoury` and `savoury` — the boolean covers it.

### 2. Load schema and existing foods

Run these in parallel:

- `mcp__Sanity__get_schema` for types `recipe`, `food`, and `ingredient` — only needed if the user reports schema changes since last import; otherwise you can skip and trust the shape documented below
- `mcp__Sanity__query_documents` with a GROQ query that finds candidate matches for every `food` canonical name from step 1. Use `match` with the lowercased stem for fuzzy matches:

  ```
  *[_type == "food" && (name match $n1 || name match $n2 || ...)]{_id, name}
  ```

  Pass each search term via `params` (e.g. `{n1: "asparagus*", n2: "olive oil*"}`). Match case-insensitively in your head — Sanity's `match` is case-insensitive.

### 3. Map ingredients to food IDs

For each canonical food name from step 1:

- If a returned food document is a clear match (same noun, ignoring case/pluralisation), reuse its `_id`.
- Otherwise add it to a "to create" list. Treat singular/plural as the same food (e.g. existing "Salad onions" matches "salad onion").

### 4. Create + publish missing foods

If the "to create" list is non-empty:

1. `mcp__Sanity__create_documents_from_json` with one entry per missing food: `{ type: "food", content: { name: "<Capitalised name>" } }`. Capitalise the first letter only; keep the rest as-is (e.g. "Pecorino romano", "Pea shoots").
2. Capture the returned `drafts.<uuid>` IDs.
3. `mcp__Sanity__publish_documents` with those draft IDs to make them live. The published IDs are the same UUIDs without the `drafts.` prefix — use those as `_ref` targets.

The user's standing instruction is that **new food documents must be published**, not left as drafts.

### 5. Create the recipe draft

Call `mcp__Sanity__create_documents_from_json` with a single recipe document:

```json
{
  "type": "recipe",
  "content": {
    "title": "<Title>",
    "slug": { "_type": "slug", "current": "<kebab-case-title>" },
    "description": "<plain text>",
    "servings": <number>,
    "prepTime": <minutes>,
    "cookingTime": <minutes>,
    "isSweet": <bool>,
    "isSavoury": <bool>,
    "courseType": "<appetizer|dessert|main|snack|starter>",
    "source": "<original URL>",
    "tags": ["tag1", "tag2", "tag3"],
    "steps": ["step 1...", "step 2..."],
    "ingredients": [
      {
        "_type": "ingredient",
        "_key": "<unique short slug>",
        "display": "<quantity + descriptor as it appears on the source>",
        "food": { "_type": "reference", "_ref": "<food UUID without drafts. prefix>" }
      }
    ]
  }
}
```

Notes:

- Every array entry needs a unique `_key` (any short stable string — e.g. `ing01lamb`, `ing02oliveoil`).
- `slug.current` is the kebab-cased title.
- Use the raw `source` URL exactly as given.
- Preserve fractions / special characters (`½`, `°`, etc.) in `display` and `steps`.

### 6. Leave the recipe as a draft

Do **not** publish the recipe — the user reviews it in the Studio and adds a photo before publishing. Report the draft `_id` so they can find it.

## Output to the user

A short report:

- Recipe title and draft ID
- Which foods were reused vs. newly created+published (just the names)
- That the recipe is left as a draft pending photo + review

Keep it tight — no step-by-step narration.

## Edge cases

- **Page is paywalled or fetch fails**: report the failure and stop. Don't fabricate ingredients.
- **Ambiguous food match** (e.g. source says "stock", existing has both "Chicken stock" and "Vegetable stock"): pick the one the recipe context implies. If genuinely unclear, ask the user.
- **Course type doesn't match the enum**: pick the closest (`main` is the usual default for dinners). Don't invent new values.
- **Sweet vs. savoury both apply** (rare — e.g. sweet-savoury glaze): set both to `true`.
- **Existing duplicate foods** (e.g. dataset has both "Chicken stock" and "chicken stock"): prefer the capitalised one and don't create a third.