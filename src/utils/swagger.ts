import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

export const swaggerBaseDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Strain Data API",
    version: "1.0.0",
    description:
      "REST API for strain data. **Swagger UI:** `/docs`. GraphQL schema and playground are available separately at `/graphql`.",
  },
};

const options: swaggerJSDoc.Options = {
  definition: swaggerBaseDefinition,
  apis: [path.join(__dirname, "..", "routes", "rest", "*.ts")],
};

export const swaggerBaseSpec = swaggerJSDoc(options);
