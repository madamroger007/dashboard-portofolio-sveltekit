import type { UpdateCertification } from "$lib/types/schema";
import { db } from "../db/client";
import { certification, type Certification } from "../db/schema_certification";
import { eq } from "drizzle-orm";

export async function getCertiAllfRepository() {
    const certif = await db.select().from(certification);
    return certif;
}

export async function getCertifByIdRepository(id: string) {
    const [certif] = await db.select().from(certification).where(eq(certification.id, id));
    return certif;
}

export async function deleteCertifRepository(id: string) {
    await db.delete(certification).where(eq(certification.id, id));
}

export async function updateCertifRepository(id: string, data: Partial<UpdateCertification>) {
    await db.update(certification).set(data).where(eq(certification.id, id));
}

export async function createCertifRepository(data: Certification) {
    await db.insert(certification).values(data);
}