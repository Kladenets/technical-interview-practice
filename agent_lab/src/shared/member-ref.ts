/** A member identifier that may cross the model boundary, but is not a backend ID. */
export type MemberRef = string & { readonly __memberRef: unique symbol };

/**
 * The member-reference seam is present from the first model-facing tool. Stages
 * 01–05 use the deliberately insecure pass-through resolver so tools learn to
 * resolve references server-side. Stage 06 swaps in deterministic tokenisation;
 * that swap must require no change to any tool signature. If it does, the seam
 * was designed incorrectly.
 */
export interface MemberRefResolver {
  toRef(memberId: string, tenantId: string): MemberRef;
  fromRef(ref: MemberRef, tenantId: string): string;
}

const prefix = 'member_ref:';
const encode = (value: string) => Buffer.from(value, 'utf8').toString('base64url');
const decode = (value: string) => Buffer.from(value, 'base64url').toString('utf8');

/**
 * A thin, intentionally non-secret wrapper for the early stages. It encodes
 * both tenant and ID only so malformed and cross-tenant references are rejected;
 * Stage 06 replaces it with an opaque tokenising resolver.
 */
export const defaultMemberRefResolver: MemberRefResolver = {
  toRef(memberId, tenantId) {
    if (!memberId || !tenantId) throw new Error('Member ID and tenant ID are required');
    return `${prefix}${encode(tenantId)}:${encode(memberId)}` as MemberRef;
  },
  fromRef(ref, tenantId) {
    if (!tenantId || !ref.startsWith(prefix)) throw new Error('Invalid member reference');
    const parts = ref.slice(prefix.length).split(':');
    if (parts.length !== 2 || !parts[0] || !parts[1]) throw new Error('Invalid member reference');
    let refTenant: string;
    let memberId: string;
    try { refTenant = decode(parts[0]); memberId = decode(parts[1]); } catch { throw new Error('Invalid member reference'); }
    if (!refTenant || !memberId) throw new Error('Invalid member reference');
    if (refTenant !== tenantId) throw new Error('Member reference is not valid for this tenant');
    return memberId;
  },
};
