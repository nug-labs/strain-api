import express from "express";
import cors from "cors";
import { createYoga } from "graphql-yoga";
import swaggerUi from "swagger-ui-express";
import { requestLogger, errorLogger } from "./middleware/logger";
import { rateLimit } from "./middleware/rateLimit";
import strainsRouter from "./routes/rest/strains.routes";
import { createSchema } from "./routes/graphql/schema";
import { swaggerBaseSpec } from "./utils/swagger";

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use(rateLimit);

app.use("/api/v1", strainsRouter);

const yoga = createYoga({
  schema: createSchema(),
  graphqlEndpoint: "/graphql",
});

app.use("/graphql", yoga as express.RequestHandler);

// Dynamic Swagger servers based on request origin
app.get("/docs.json", (req, res) => {
  const origin =
    (req.headers["x-forwarded-proto"] as string | undefined) && req.headers["x-forwarded-host"]
      ? `${req.headers["x-forwarded-proto"]}://${req.headers["x-forwarded-host"]}`
      : `${req.protocol}://${req.get("host")}`;

  const spec = {
    ...swaggerBaseSpec,
    servers: [
      {
        url: origin,
        description: "Current server",
      },
    ],
  };

  res.json(spec);
});

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/docs.json",
    },
  })
);

app.use(errorLogger);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Strain Data API listening on port ${PORT}`);
  console.log("Swagger docs: http://localhost:%s/docs", PORT);
});
