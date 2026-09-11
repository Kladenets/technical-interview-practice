type Organization = { id: string; name: string }
type User = { id: string; organizationId: string; roleIds: string[] }
type Role = { id: string; permissions: string[]; parentRoleId?: string }
type AuditEntry = { userId: string; organizationId: string; permission: string; allowed: boolean }

export class TenantAuthorizationService {
  private organizations = new Map<string, Organization>()
  private users = new Map<string, User>()
  private roles = new Map<string, Role>()
  private audit: AuditEntry[] = []

  addOrganization(id: string, name: string): Organization {
    if (this.organizations.has(id)) throw new Error('organization already exists')
    const organization = { id, name }
    this.organizations.set(id, organization)
    return organization
  }

  addUser(id: string, organizationId: string): User {
    if (!this.organizations.has(organizationId)) throw new Error('unknown organization')
    if (this.users.has(id)) throw new Error('user already exists')
    const user = { id, organizationId, roleIds: [] }
    this.users.set(id, user)
    return user
  }

  addRole(id: string, permissions: string[], parentRoleId?: string): Role {
    if (this.roles.has(id)) throw new Error('role already exists')
    if (parentRoleId && !this.roles.has(parentRoleId)) throw new Error('unknown parent role')
    const role = { id, permissions: [...permissions], ...(parentRoleId ? { parentRoleId } : {}) }
    this.roles.set(id, role)
    return role
  }

  assignRole(userId: string, roleId: string): void {
    const user = this.users.get(userId)
    if (!user || !this.roles.has(roleId)) throw new Error('unknown user or role')
    if (!user.roleIds.includes(roleId)) user.roleIds.push(roleId)
  }

  private hasPermission(roleId: string, permission: string, seen = new Set<string>()): boolean {
    if (seen.has(roleId)) return false
    seen.add(roleId)
    const role = this.roles.get(roleId)
    if (!role) return false
    if (role.permissions.includes(permission) || role.permissions.includes('*')) return true
    return role.parentRoleId ? this.hasPermission(role.parentRoleId, permission, seen) : false
  }

  canAccess(userId: string, organizationId: string, permission: string): boolean {
    const user = this.users.get(userId)
    const allowed = Boolean(
      user &&
      user.organizationId === organizationId &&
      user.roleIds.some((roleId) => this.hasPermission(roleId, permission)),
    )
    this.audit.push({ userId, organizationId, permission, allowed })
    return allowed
  }

  getAuditLog(): AuditEntry[] {
    return [...this.audit]
  }
}