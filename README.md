# Strain Data API

The Strain Data API powers NugLabs search experiences with a fast, read‑only view of your cannabis strain catalogue.

The production API is available at **`https://strains.nuglabs.co`**.

## What it provides

- **REST endpoint** – list of all strains in a flattened JSON format:
  - `GET /api/v1/strains`
- **GraphQL endpoint** – flexible querying of strain fields:
  - `POST /graphql`
  - Example:
    ```graphql
    query {
      strains {
        name
        type
        thc
        detailed_terpenes
        helps_with
      }
    }
    ```
- **Swagger docs** – human‑readable documentation:
  - `/docs` ( served from the same host as the API )

### Example REST response (truncated)

```json
[
  {
    "id": 40,
    "name": "Mimosa",
    "type": "Hybrid",
    "thc": 19,
    "akas": ["Purple Mimosa", "Mimosas"],
    "flavors": ["Citrus"],
    "detailed_terpenes": ["Myrcene", "Pinene", "Caryophyllene"],
    "helps_with": ["Anxiety", "Stress", "Depression"],
    "description": "Mimosa is a hybrid strain created by crossing Clementine with Purple Punch, offering happy, uplifting, and motivating effects in small doses."
  }
]
```

## Typical use cases

- Powering **search UIs** ( web, mobile, bots ) that need fast, in‑memory strain lookup from a single canonical source.
- Feeding **autocomplete and filtering** components that need the full data set client‑side.
- Enabling **internal tools** ( e.g. content editors, merch dashboards ) to inspect current strain metadata without touching the scraping pipeline.
