import type { ContactSuccessResponse } from "@devflow/shared";
import { randomUUID } from "node:crypto";

import { db } from "../../db/client";
import { contacts } from "../../db/schema";

import type { ContactRequestDTO } from "./contact.schema";

export class ContactService {
  async submitContact(dto: ContactRequestDTO): Promise<ContactSuccessResponse> {
    await db.insert(contacts).values({
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      name: dto.name.trim(),
      email: dto.email.toLowerCase().trim(),
      message: dto.message,
    });

    return { ok: true };
  }
}
