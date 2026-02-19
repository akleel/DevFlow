import cors from "@fastify/cors";
import Fastify from "fastify";

import { env } from "./config/env";
import { registerErrorHandler } from "./middleware/error-handler";
import { registerRateLimit } from "./middleware/rate-limit";
import { registerRequestId } from "./middleware/request-id";
import { registerRoutes } from "./routes/index";

const app = Fastify({ logger: true });

// CORS (only relevant if the browser calls the API directly)
await app.register(cors, {
  origin: [env.WEB_ORIGIN],
  credentials: true,
});

registerErrorHandler(app);
registerRequestId(app);
await registerRateLimit(app);

await app.register(registerRoutes);

await app.listen({
  port: env.PORT,
  host: "0.0.0.0",
});
