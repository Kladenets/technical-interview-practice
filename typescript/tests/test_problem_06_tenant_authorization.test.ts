import { TenantAuthorizationService } from '../practice_problems/problem_06_tenant_authorization'

describe('TenantAuthorizationService', () => {
  function createService() {
    const service = new TenantAuthorizationService()
    service.addOrganization('org-a', 'Alpha')
    service.addOrganization('org-b', 'Beta')
    service.addUser('user-a', 'org-a')
    service.addUser('user-b', 'org-b')
    service.addRole('viewer', ['workflow:read'])
    service.addRole('admin', ['workflow:write'], 'viewer')
    service.assignRole('user-a', 'admin')
    service.assignRole('user-b', 'viewer')
    return service
  }

  it('creates organizations, users, and roles', () => {
    const service = new TenantAuthorizationService()
    expect(service.addOrganization('org', 'Operations')).toEqual({ id: 'org', name: 'Operations' })
    expect(service.addUser('user', 'org')).toMatchObject({ id: 'user', organizationId: 'org', roleIds: [] })
    expect(service.addRole('viewer', ['workflow:read'])).toEqual({ id: 'viewer', permissions: ['workflow:read'] })
  })

  it('rejects duplicate and unknown relationships', () => {
    const service = new TenantAuthorizationService()
    service.addOrganization('org', 'Operations')
    expect(() => service.addOrganization('org', 'Again')).toThrow()
    expect(() => service.addUser('user', 'missing')).toThrow()
    expect(() => service.addRole('admin', ['write'], 'missing')).toThrow()
  })

  it('allows a user to access resources in their organization', () => {
    const service = createService()
    expect(service.canAccess('user-a', 'org-a', 'workflow:write')).toBe(true)
    expect(service.canAccess('user-a', 'org-a', 'workflow:read')).toBe(true)
  })

  it('denies cross-tenant access', () => {
    const service = createService()
    expect(service.canAccess('user-a', 'org-b', 'workflow:read')).toBe(false)
  })

  it('inherits permissions from a parent role', () => {
    const service = createService()
    expect(service.canAccess('user-b', 'org-b', 'workflow:read')).toBe(true)
    expect(service.canAccess('user-b', 'org-b', 'workflow:write')).toBe(false)
  })

  it('records allowed and denied decisions for auditing', () => {
    const service = createService()
    service.canAccess('user-a', 'org-a', 'workflow:read')
    service.canAccess('user-a', 'org-b', 'workflow:read')
    expect(service.getAuditLog()).toEqual([
      { userId: 'user-a', organizationId: 'org-a', permission: 'workflow:read', allowed: true },
      { userId: 'user-a', organizationId: 'org-b', permission: 'workflow:read', allowed: false },
    ])
  })
})