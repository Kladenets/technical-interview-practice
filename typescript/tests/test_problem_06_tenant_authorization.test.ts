/**
 * Tests for Problem 06 — Multi-Tenant Workflow Authorization
 *
 * Run (from typescript/):
 *   PRACTICE_ANSWER=kk_answer_06_tenant_authorization npm run test:06
 */

import { TenantAuthorizationService } from '../practice_problems/problem_06_tenant_authorization'

// ── Part 1 ─────────────────────────────────────────────────────────────────

describe('Part 1 — Organizations, users, roles, and assignments', () => {
  let service: TenantAuthorizationService

  beforeEach(() => {
    service = new TenantAuthorizationService()
  })

  it('addOrganization returns an organization with correct fields', () => {
    expect(service.addOrganization('org-a', 'Alpha')).toEqual({ id: 'org-a', name: 'Alpha' })
  })

  it('addOrganization throws on duplicate id', () => {
    service.addOrganization('org-a', 'Alpha')
    expect(() => service.addOrganization('org-a', 'Again')).toThrow()
  })

  it('addUser returns a user with empty roleIds', () => {
    service.addOrganization('org-a', 'Alpha')
    expect(service.addUser('user-a', 'org-a')).toEqual({ id: 'user-a', organizationId: 'org-a', roleIds: [] })
  })

  it('addUser throws on duplicate id', () => {
    service.addOrganization('org-a', 'Alpha')
    service.addUser('user-a', 'org-a')
    expect(() => service.addUser('user-a', 'org-a')).toThrow()
  })

  it('addUser throws for an unknown organization', () => {
    expect(() => service.addUser('user-a', 'missing')).toThrow()
  })

  it('addRole returns a role with correct fields', () => {
    expect(service.addRole('viewer', ['workflow:read'])).toEqual({ id: 'viewer', permissions: ['workflow:read'] })
  })

  it('addRole throws on duplicate id', () => {
    service.addRole('viewer', ['workflow:read'])
    expect(() => service.addRole('viewer', ['workflow:write'])).toThrow()
    expect(() => service.addRole('operator', ['workflow:write'], 'missing')).toThrow()
  })

  it('addRole defensively copies permissions', () => {
    const permissions = ['workflow:read']
    const role = service.addRole('viewer', permissions)
    permissions.push('workflow:write')
    expect(role.permissions).toEqual(['workflow:read'])
  })

  it('assignRole throws for an unknown user or role', () => {
    service.addOrganization('org-a', 'Alpha')
    service.addUser('user-a', 'org-a')
    service.addRole('viewer', ['workflow:read'])
    expect(() => service.assignRole('missing', 'viewer')).toThrow()
    expect(() => service.assignRole('user-a', 'missing')).toThrow()
  })

  it('assignRole is idempotent', () => {
    service.addOrganization('org-a', 'Alpha')
    const user = service.addUser('user-a', 'org-a')
    service.addRole('viewer', ['workflow:read'])
    service.assignRole('user-a', 'viewer')
    service.assignRole('user-a', 'viewer')
    expect(user.roleIds).toEqual(['viewer'])
  })
})

// ── Part 2 ─────────────────────────────────────────────────────────────────

describe('Part 2 — Resource-scoped authorization', () => {
  let service: TenantAuthorizationService

  beforeEach(() => {
    service = new TenantAuthorizationService()
    service.addOrganization('org-a', 'Alpha')
    service.addOrganization('org-b', 'Beta')
    service.addUser('user-a', 'org-a')
    service.addUser('user-b', 'org-b')
    service.addUser('user-none', 'org-a')
    service.addRole('viewer', ['workflow:read'])
    service.addRole('writer', ['workflow:write'])
    service.assignRole('user-a', 'viewer')
    service.assignRole('user-b', 'viewer')
    service.addResource('workflow-a', 'org-a', 'Alpha workflow')
    service.addResource('workflow-b', 'org-b', 'Beta workflow')
  })

  it('addResource returns a live resource with correct fields', () => {
    expect(service.addResource('workflow-c', 'org-a', 'New workflow')).toEqual({
      id: 'workflow-c', organizationId: 'org-a', name: 'New workflow', deleted: false,
    })
  })

  it('addResource throws on duplicate id', () => {
    expect(() => service.addResource('workflow-a', 'org-a', 'Again')).toThrow()
  })

  it('addResource throws for an unknown organization', () => {
    expect(() => service.addResource('workflow-c', 'missing', 'Missing')).toThrow()
  })

  it('allows the permission granted by a role', () => {
    expect(service.canAccess('user-a', 'workflow-a', 'workflow:read')).toBe(true)
  })

  it('denies a permission the role lacks', () => {
    expect(service.canAccess('user-a', 'workflow-a', 'workflow:write')).toBe(false)
  })

  it('denies cross-organization access', () => {
    expect(service.canAccess('user-a', 'workflow-b', 'workflow:read')).toBe(false)
  })

  it('returns false for an unknown user or resource', () => {
    expect(service.canAccess('missing', 'workflow-a', 'workflow:read')).toBe(false)
    expect(service.canAccess('user-a', 'missing', 'workflow:read')).toBe(false)
  })

  it('allows when one of multiple roles grants the permission', () => {
    service.assignRole('user-a', 'writer')
    expect(service.canAccess('user-a', 'workflow-a', 'workflow:write')).toBe(true)
  })

  it('denies a user with no roles', () => {
    expect(service.canAccess('user-none', 'workflow-a', 'workflow:read')).toBe(false)
  })
})

// ── Part 3 ─────────────────────────────────────────────────────────────────

describe('Part 3 — Inheritance, lifecycle, and audit', () => {
  let service: TenantAuthorizationService

  beforeEach(() => {
    service = new TenantAuthorizationService()
    service.addOrganization('org-a', 'Alpha')
    service.addOrganization('org-b', 'Beta')
    service.addUser('user-a', 'org-a')
    service.addUser('user-b', 'org-b')
    service.addRole('reader', ['workflow:read'])
    service.addRole('editor', ['workflow:write'], 'reader')
    service.assignRole('user-a', 'editor')
    service.assignRole('user-b', 'reader')
    service.addResource('workflow-a', 'org-a', 'Alpha workflow')
    service.addResource('workflow-b', 'org-b', 'Beta workflow')
  })

  it('inherits permissions transitively through a grandparent role', () => {
    service.addRole('approver', ['workflow:approve'], 'editor')
    service.assignRole('user-a', 'approver')
    expect(service.canAccess('user-a', 'workflow-a', 'workflow:read')).toBe(true)
  })

  it('denies access after a resource is deleted', () => {
    service.deleteResource('workflow-a')
    expect(service.canAccess('user-a', 'workflow-a', 'workflow:read')).toBe(false)
  })

  it('allows after transferring a resource to the user organization', () => {
    service.transferResource('workflow-b', 'org-a')
    expect(service.canAccess('user-a', 'workflow-b', 'workflow:read')).toBe(true)
  })

  it('denies the original organization after a transfer', () => {
    service.transferResource('workflow-b', 'org-a')
    expect(service.canAccess('user-b', 'workflow-b', 'workflow:read')).toBe(false)
  })

  it('denies a deleted cross-organization resource as deleted', () => {
    service.deleteResource('workflow-b')
    expect(service.canAccess('user-a', 'workflow-b', 'workflow:read')).toBe(false)
    expect(service.getAuditLog()[0].reason).toBe('resource deleted')
  })

  it('keeps a deleted resource inaccessible after transfer', () => {
    service.deleteResource('workflow-b')
    service.transferResource('workflow-b', 'org-a')
    expect(service.canAccess('user-a', 'workflow-b', 'workflow:read')).toBe(false)
    expect(service.getAuditLog()[0].reason).toBe('resource deleted')
  })

  it('throws when deleting an unknown resource', () => {
    expect(() => service.deleteResource('missing')).toThrow()
  })

  it('throws when transferring an unknown resource', () => {
    expect(() => service.transferResource('missing', 'org-a')).toThrow()
  })

  it('throws when transferring to an unknown organization', () => {
    expect(() => service.transferResource('workflow-a', 'missing')).toThrow()
  })

  it('records audit entries in canAccess decision order', () => {
    service.canAccess('user-a', 'workflow-a', 'workflow:read')
    service.canAccess('user-a', 'workflow-b', 'workflow:read')
    expect(service.getAuditLog()).toEqual([
      { userId: 'user-a', resourceId: 'workflow-a', permission: 'workflow:read', allowed: true, reason: 'allowed' },
      { userId: 'user-a', resourceId: 'workflow-b', permission: 'workflow:read', allowed: false, reason: 'different organization' },
    ])
  })

  it('records the required reason for every denial branch', () => {
    service.deleteResource('workflow-b')
    service.canAccess('missing', 'missing', 'workflow:read')
    service.canAccess('user-a', 'missing', 'workflow:read')
    service.canAccess('user-b', 'workflow-b', 'workflow:read')
    service.canAccess('user-b', 'workflow-a', 'workflow:read')
    service.canAccess('user-a', 'workflow-a', 'workflow:delete')
    expect(service.getAuditLog().map((entry: any) => entry.reason)).toEqual([
      'unknown user', 'unknown resource', 'resource deleted', 'different organization', 'missing permission',
    ])
  })

  it('returns a defensive copy of the audit log', () => {
    service.canAccess('user-a', 'workflow-a', 'workflow:read')
    const audit = service.getAuditLog()
    audit[0].reason = 'missing permission'
    audit.pop()
    expect(service.getAuditLog()).toHaveLength(1)
    expect(service.getAuditLog()[0].reason).toBe('allowed')
  })

  it('audits denials as well as approvals', () => {
    service.canAccess('user-a', 'workflow-a', 'workflow:read')
    service.canAccess('user-a', 'workflow-a', 'workflow:delete')
    expect(service.getAuditLog().map((entry: any) => entry.allowed)).toEqual([true, false])
  })
})
