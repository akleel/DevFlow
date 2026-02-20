import type { FastifyInstance } from "fastify";

import { adminRoutes } from "../modules/admin/admin.route";
import { contactRoutes } from "../modules/contact/contact.route";

export async function registerRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({ ok: true }));

  await app.register(contactRoutes, { prefix: "/api" });
  await app.register(adminRoutes, { prefix: "/api" });
}
