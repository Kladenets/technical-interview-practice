import { describe, expect, it } from 'vitest';
import { defaultMemberRefResolver } from './member-ref.js';

describe('defaultMemberRefResolver', () => {
  it('round-trips a member ID within its tenant', () => {
    const ref = defaultMemberRefResolver.toRef('member-ada', 'tenant-northstar');
    expect(defaultMemberRefResolver.fromRef(ref, 'tenant-northstar')).toBe('member-ada');
  });
  it('does not resolve a reference under another tenant', () => {
    const ref = defaultMemberRefResolver.toRef('member-ada', 'tenant-northstar');
    expect(() => defaultMemberRefResolver.fromRef(ref, 'tenant-lakeside')).toThrow(/tenant/i);
  });
  it('rejects malformed references', () => {
    expect(() => defaultMemberRefResolver.fromRef('member-ada' as never, 'tenant-northstar')).toThrow(/invalid/i);
  });
});
