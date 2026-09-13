import { createHash } from 'node:crypto';
import { z } from 'zod';

export const CoverageChangeInputSchema = z.object({ memberId: z.string().min(1), targetStatus: z.enum(['active', 'inactive']) }).strict();
export const CoverageChangeActionSchema = z.object({ type: z.literal('coverage.change'), input: CoverageChangeInputSchema }).strict();
export const ActionSchema = z.discriminatedUnion('type', [CoverageChangeActionSchema]);
export const PreviewSchema = z.object({ summary: z.string(), changes: z.array(z.object({ field: z.string(), before: z.unknown(), after: z.unknown() }).strict()) }).strict();
const IsoDateTime = z.string().datetime({ offset: true });
export const ActionEnvelopeSchema = z.object({
  schemaVersion: z.literal('1'), actionId: z.string().min(1), tenantId: z.string().min(1), actorId: z.string().min(1),
  toolName: z.literal('proposeCoverageChange'), action: ActionSchema, preview: PreviewSchema, recordRevision: z.number().int().nonnegative(),
  risk: z.enum(['low', 'medium', 'high']), createdAt: IsoDateTime, expiresAt: IsoDateTime, idempotencyKey: z.string().min(1),
}).strict();
export type ActionEnvelope = z.infer<typeof ActionEnvelopeSchema>;

/** Canonical JSON is recursively key-sorted, so semantically identical objects hash identically. */
export function canonicalise(input: unknown): string {
  if (input === null || typeof input !== 'object') return JSON.stringify(input);
  if (Array.isArray(input)) return `[${input.map(canonicalise).join(',')}]`;
  const object = input as Record<string, unknown>;
  return `{${Object.keys(object).sort().map(key => `${JSON.stringify(key)}:${canonicalise(object[key])}`).join(',')}}`;
}
/**
 * Binding contract: an approval records this hash and execution must recompute it.
 * It commits to the typed action input, the complete reviewer-visible structured
 * preview, and the source record revision. Changing any of these invalidates approval.
 */
export function computeBindingHash(envelope: Pick<ActionEnvelope, 'action' | 'preview' | 'recordRevision'>): string {
  return createHash('sha256').update(canonicalise({ action: envelope.action, preview: envelope.preview, recordRevision: envelope.recordRevision })).digest('hex');
}
export function computeIdempotencyKey(action: ActionEnvelope['action']): string {
  return createHash('sha256').update(canonicalise(action)).digest('hex');
}
