# Strain Data API

TypeScript Express + GraphQL API for strain data.

- **REST:** `GET /api/v1/strains` – all strains
- **GraphQL:** `POST /graphql` – query `strains { name, thc, cbd, ... }`
- **Swagger docs:** **`/docs`** (e.g. http://localhost:8080/docs)

## Run locally

```bash
npm install
npm run dev
```

## Docker

From repo root:

```bash
docker build -t strain-data-api ./app/strain-data
docker run -p 8080:8080 strain-data-api
```

## Deploy

From repo root:

```bash
./deploy-strain-api.sh
```
