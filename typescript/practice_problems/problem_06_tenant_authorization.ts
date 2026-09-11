/**
 * =============================================================================
 * INTERVIEW PROBLEM 06: Multi-Tenant Workflow Authorization
 * Difficulty: Senior Software Engineer | Estimated time: 45–60 min
 * =============================================================================
 *
 * CONTEXT
 * -------
 * You're building the authorization boundary for a multi-tenant workflow
 * product. Users belong to organizations, roles grant permissions, and workflow
 * resources can be transferred or retired over time.
 *
 * Store all state in instance variables initialised in the constructor.
 * You choose the internal data structures; the public interface is what matters.
 *
 * ⚠️  TYPE CONTRACT
 * -----------------
 * This problem intentionally omits interface definitions for domain objects
 * and return values. Part of the challenge is designing well-typed TypeScript
 * interfaces that accurately model the domain. Define your types in your
 * answer file before implementing the methods.
 *
 * You will need types for at least:
 *   Organization: { id: string; name: string }
 *   User: { id: string; organizationId: string; roleIds: string[] }
 *   Role: { id: string; permissions: string[]; parentRoleId?: string }
 *   Resource: { id: string; organizationId: string; name: string; deleted: boolean }
 *   AuditEntry: { userId: string; resourceId: string; permission: string;
 *                 allowed: boolean; reason: string }
 *
 * // Example
 * // const service = new TenantAuthorizationService()
 * // service.addOrganization('org-a', 'Alpha')
 * // service.addUser('user-a', 'org-a')
 * // service.addRole('viewer', ['workflow:read'])
 * // service.assignRole('user-a', 'viewer')
 * // service.addResource('workflow-a', 'org-a', 'Intake')
 * // service.canAccess('user-a', 'workflow-a', 'workflow:read')  // → true
 *
 * =============================================================================
 * PART 1 — Organizations, users, roles, and assignments
 * =============================================================================
 *
 * Add organizations and users, define roles with permissions, and assign roles
 * to users. Reject duplicate IDs and relationships that reference unknown
 * organizations, users, or roles.
 *
 * =============================================================================
 * PART 2 — Resource-scoped authorization
 * =============================================================================
 *
 * Add workflow resources owned by an organization. canAccess() should allow a
 * user with a direct role permission to access a live resource in the user's
 * organization, and deny unknown users/resources, cross-organization access,
 * and missing permissions.
 *
 * =============================================================================
 * PART 3 — Inheritance, lifecycle, and audit
 * =============================================================================
 *
 * Support inherited role permissions. Resources can be transferred between
 * organizations or marked deleted; deleted resources must never be accessible.
 * Record every authorization decision with its resource, permission, outcome,
 * and a useful reason for the decision. Return defensive copies of the audit
 * log and its entries so callers cannot mutate service state.
 */

// ── Class ──────────────────────────────────────────────────────────────────

export class TenantAuthorizationService {
  constructor() {
    throw new Error('Not implemented')
  }

  // ── Part 1 ───────────────────────────────────────────────────────────────

  /**
   * Add an organization.
   * Returns: the created organization.
   * @throws {Error} if id already exists
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addOrganization(id: string, name: string): any {
    throw new Error('Not implemented')
  }

  /**
   * Add a user to an organization.
   * Returns: the created user with an empty roleIds array.
   * @throws {Error} if id already exists
   * @throws {Error} if organizationId is unknown
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addUser(id: string, organizationId: string): any {
    throw new Error('Not implemented')
  }

  /**
   * Add a role. Store a defensive copy of permissions.
   * parentRoleId is only meaningful in Part 3.
   * Returns: the created role.
   * @throws {Error} if id already exists
   * @throws {Error} if parentRoleId is provided but unknown
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addRole(id: string, permissions: string[], parentRoleId?: string): any {
    throw new Error('Not implemented')
  }

  /**
   * Assign a role to a user. Idempotent: assigning the same role twice does
   * not duplicate it.
   * @throws {Error} if userId or roleId is unknown
   */
  assignRole(userId: string, roleId: string): void {
    throw new Error('Not implemented')
  }

  // ── Part 2 ───────────────────────────────────────────────────────────────

  /**
   * Add a workflow resource owned by an organization.
   * Returns: the created resource with deleted=false.
   * @throws {Error} if id already exists
   * @throws {Error} if organizationId is unknown
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addResource(id: string, organizationId: string, name: string): any {
    throw new Error('Not implemented')
  }

  /**
   * Return true only when the user and resource exist, the resource is live,
   * both belong to the same organization, and one user role grants permission.
   * Returns false (does not throw) for unknown users and unknown resources.
   *
   * Part 3 records every decision in the audit log and honours inherited role
   * permissions. A role inherits its parent's permissions transitively (resolve
   * inheritance iteratively or recursively; guarding against a repeated role id
   * is cheap insurance if you later allow re-parenting).
   */
  canAccess(userId: string, resourceId: string, permission: string): boolean {
    throw new Error('Not implemented')
  }

  // ── Part 3 ───────────────────────────────────────────────────────────────

  /**
   * Soft-delete a resource. A deleted resource is never accessible.
   * @throws {Error} if resourceId is unknown
   */
  deleteResource(resourceId: string): void {
    throw new Error('Not implemented')
  }

  /**
   * Transfer a resource to another organization's ownership.
   * @throws {Error} if resourceId is unknown
   * @throws {Error} if organizationId is unknown
   */
  transferResource(resourceId: string, organizationId: string): void {
    throw new Error('Not implemented')
  }

  /**
   * Return defensive copies of authorization decisions in decision order.
   * Each entry is { userId, resourceId, permission, allowed, reason }.
   *
   * Reasons are evaluated in this order: 'unknown user', 'unknown resource',
   * 'resource deleted', 'different organization', 'missing permission', and
   * 'allowed'.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAuditLog(): any[] {
    throw new Error('Not implemented')
  }
}
