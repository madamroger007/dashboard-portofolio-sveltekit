// src/lib/server/repositories/certificationRepository.ts
import type { UpdateCertification } from "$lib/types/schema";
import { db } from "../db/client";
import { certification, type Certification } from "../db/schema_certification";
import { eq } from "drizzle-orm";
import { getCache, setCache, delCache } from "$lib/server/repositories/redisRepository";

export async function getCertifAllRepository(): Promise<Certification[]> {
  const cacheKey = "certif:all";
  const cached = await getCache<Certification[]>(cacheKey);
  if (cached) return cached;

  const certif = await db.select().from(certification);
  await setCache(cacheKey, certif);
  return certif;
}


export async function getCertifByIdRepository(id: string): Promise<Certification | undefined> {
  const cacheKey = `certif:${id}`;
  const cached = await getCache<Certification>(cacheKey);
  if (cached) return cached;

  const [certif] = await db.select().from(certification).where(eq(certification.id, id));
  if (certif) await setCache(cacheKey, certif);
  return certif;
}

export async function deleteCertifRepository(id: string): Promise<void> {
  await db.delete(certification).where(eq(certification.id, id));
  await delCache(`certif:${id}`);
  await delCache("certif:all");
}


export async function updateCertifRepository(id: string, data: Partial<UpdateCertification>): Promise<void> {
  await db.update(certification).set(data).where(eq(certification.id, id));
  await delCache(`certif:${id}`);
  await delCache("certif:all");
}


export async function createCertifRepository(data: Certification): Promise<void> {
  await db.insert(certification).values(data);
  await delCache("certif:all");
}
