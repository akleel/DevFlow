import Fastify from "fastify";
import cors from "@fastify/cors";

import { env } from "./config/env";
import { registerErrorHandler } from "./middleware/error-handler";
import { registerRoutes } from "./routes/index";
import { registerRequestId } from './middleware/request-id';
import { registerRateLimit } from './middleware/rate-limit';



const app = Fastify({ logger: true });

// CORS (for Next frontend)
await app.register(cors, {
  origin: [env.WEB_ORIGIN],
  credentials: true,
});

// Central error handler
registerErrorHandler(app);
registerRequestId(app);
await registerRateLimit(app);



// Routes
await app.register(registerRoutes);

await app.listen({
  port: env.PORT,
  host: "0.0.0.0",
});
